Framework decision: Django vs FastAPI for this use case

Django makes sense if you want the admin panel, ORM, and auth out of the box. But for an embedded medical device talking to AWS, FastAPI is genuinely better here — async by default, 3–5x faster throughput, lighter RAM footprint on EC2, and cleaner for a pure API backend with no server-side HTML. Since your Pi has an HDMI monitor, the "display" is a local React/Next.js frontend served separately, not Django templates. That changes the architecture.

Recommendation: FastAPI on AWS + React on Pi. Django only if you need the admin panel for managing patients/operators and don't want to build that UI yourself. I'll build the flowchart FastAPI-first but flag every Django swap point.

Perfect stack. FastAPI + Django Admin sidecar is the right call — best of both. PDF link only is the correct privacy-first choice for patient WhatsApp under DPDPA 2023. 10–50 devices means we need proper device identity, not a shared secret. Building the full thing now.
Claude's response was interrupted
You said: Q: Backend framework — locking this in now

Q: Backend framework — locking this in now
A: FastAPI (faster, async, lighter)

Q: Patient WhatsApp — what goes in the message?
A: Result + PDF + book followup link

Q: How many devices (Pis) will connect to one AWS backend?
A: 2–10 devices (small chain)
11:24 am
Claude responded: Now I have everything.

Now I have everything. Building the complete production flowchart.
Complete component breakdown

Physical layer — sealed enclosure The LED is driven by GPIO18 PWM, not the AS7341's onboard LED. The onboard LED has no intensity control and sits at 0° — it creates specular hotspots on the pad surface. External ring at 45° eliminates that. The PTFE tile never leaves the cradle — if operators handle it they contaminate the surface and white reference drifts.

Pi calibration — 5-step sequence every power-on Step 5 averages 3 reads 500ms apart. This is not optional — a single AS7341 read has ±2% noise, three averaged reads bring it to ±0.8%. At clinical thresholds (e.g. trace protein vs 1+) that 1.2% difference is the margin between correct and incorrect classification.

Device identity — mTLS per device, not shared HMAC For a 2–10 device fleet, each Pi gets its own cert.pem + key.pem issued from a private CA you control (AWS Private CA, ~$400/yr). The ALB validates the client cert on every connection. This means a stolen device cannot impersonate another clinic, and you can revoke a single device without touching the others. Certs rotate every 90 days via a cron job on the Pi.

Offline queue — critical for clinic environments Indian clinic internet is unreliable. aiosqlite gives you an async local queue that buffers every signed payload. When connectivity returns the drain loop replays them in order, preserving timestamps. The server deduplicates on (device_id, nonce) — replayed packets are idempotent.

FastAPI on ECS Fargate — why not EC2 Fargate means zero server management, auto-scaling from 2 to 8 tasks on CPU, and per-task IAM roles (no instance profile shared across everything). For 2–10 devices the load is light — 2 tasks idle, scales up during morning clinic rush. Cost is ~$40–60/month at this scale.

SQS over Redis as Celery broker Redis as broker works fine for 1 device. For a fleet, SQS gives you: dead-letter queues for failed ML jobs (automatic retry capture), per-message visibility timeout (ML inference takes 800ms — Redis tasks can ghost), and no broker single-point-of-failure. Redis stays as the Celery result backend and Django cache only.

ML worker — models loaded at startup, not per-request The 8 joblib RF models load into memory when the Celery worker container starts. Each inference call then takes ~40ms. If you loaded models per-request it would be 600ms+ per job. The worker container runs on 2vCPU 4GB — RF inference is CPU-bound, Fargate handles the scaling.

OOD detection before classification Mahalanobis distance computed against the training set mean and covariance. If a reading is more than 3 standard deviations from any known class cluster it is flagged inconclusive rather than forced into a class. This catches: wrong strip brand inserted, expired strip, contaminated pad, sensor drift. Without this, the classifier will always output a label — it has no concept of "I've never seen this before."

WhatsApp HSM template — 5 fields Meta requires pre-approval of every template. File it as a utility template (not marketing — utility gets faster approval and higher delivery rate). The 5 fields are: patient name, one-line plain-language summary, presigned PDF URL (24h TTL from CloudFront), Calendly booking link, DPDPA consent footer. The PDF link goes through CloudFront — this gives you edge caching and hides the S3 bucket URL from patients.

S3 Object Lock WORM — 7 years CDSCO and DPDPA both require medical records retained for 7 years minimum. Object Lock in compliance mode means nobody — including your root AWS account — can delete or overwrite a PDF once written. This is your legal protection if a result is ever disputed.

Django admin sidecar — internal VPC only The /admin/ path is not exposed through the ALB. It runs on a separate ECS task accessible only via AWS Systems Manager Session Manager or a VPN. This is intentional — admin access to patient data should never be internet-facing.

CDSCO audit export The PostgreSQL audit table has a DB-level trigger (BEFORE UPDATE OR DELETE → RAISE EXCEPTION) — no application code can bypass it. The CDSCO export job queries this table, generates a signed PDF bundle (WeasyPrint + SHA-256 manifest), and uploads to S3. This is your Form MD-14 adverse event package if anything ever goes wrong.