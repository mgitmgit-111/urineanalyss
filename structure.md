/
├── firmware/
│   ├── sensor_reader.py       # systemd service — 5-step cal + sign
│   ├── offline_queue.py       # aiosqlite buffer + drain loop
│   ├── led_control.py         # GPIO18 PWM driver
│   ├── calibration/
│   │   ├── lot_ref.json       # per-lot reference values
│   │   └── temp_curves.json   # NTC correction lookup
│   └── certs/                 # cert.pem + key.pem (gitignored)
│
├── backend/
│   ├── main.py                # FastAPI app + route registration
│   ├── routes/
│   │   ├── reading.py         # POST /v1/reading
│   │   ├── patient.py         # POST /v1/patient + consent
│   │   └── result.py          # GET /v1/result/{id} SSE
│   ├── workers/
│   │   ├── ml_analyse.py      # Celery — OOD + RF inference
│   │   ├── pdf_generate.py    # Celery — WeasyPrint + S3
│   │   └── notify_dispatch.py # Celery — WhatsApp API
│   ├── models/                # SQLAlchemy async models
│   ├── ml/
│   │   ├── models/            # 8x .joblib files (gitignored, pulled from S3)
│   │   ├── ood.py             # Mahalanobis OOD detector
│   │   └── classifier.py      # RF loader + inference
│   └── admin/                 # Django admin sidecar
│
├── frontend/                  # React + Vite — HDMI display UI
│
├── infra/                     # Terraform — all AWS resources
│   ├── ecs.tf
│   ├── rds.tf
│   ├── s3.tf
│   ├── sqs.tf
│   └── waf.tf
│
└── docs/
    ├── cdsco/                 # IEC 62304 + ISO 14971 docs
    └── clinical/              # Performance study data