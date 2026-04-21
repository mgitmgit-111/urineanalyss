flowchart TD

subgraph group_hardware["Hardware layer"]
  node_sensor(("Spectral sensor\nAS7341 / AS7265x\n[I2C / SPI]"))
  node_mcu["MCU / Raspberry Pi\nreader script\n[sensor_reader.py]"]
end

subgraph group_project["Django project"]
  node_manage_py["manage.py\nentrypoint\n[manage.py]"]
  node_settings["settings\nconfig\n[settings.py]"]
  node_project_urls["project urls\nrouter\n[urls.py]"]
  node_wsgi["wsgi.py\ndeployment\n[wsgi.py]"]
end

subgraph group_app["strip_analyzer"]
  node_app_urls["app urls\nrouter\n[urls.py]"]
  node_ingest["ingest_reading\nview\n[views.py]"]
  node_analyze["analyze_spectral\nprocessor\n[analyzer.py]"]
  node_calibration["calibration\nwhite ref + dark current\n[calibration.py]"]
  node_models["SpectralReading\nmodel\n[models.py]"]
end

subgraph group_assets["UI assets"]
  node_template["results.html\nread-only display\n[results.html]"]
  node_style["style.css\nstylesheet\n[style.css]"]
end

subgraph group_data["Local state"]
  node_db[("db.sqlite3\nsqlite store\n[db.sqlite3]")]
  node_calib_file["calibration.json\nreference values\n[calibration.json]"]
end

node_json["JSON response\n{URO, BIL, KET, BLD,\nPRO, NIT, LEU, GLU, SG}"]
node_browser(("Browser\nclient"))
node_requirements["requirements\ndependencies\n[requirements.txt]"]

node_sensor -->|"raw channel data\n380–1000 nm"| node_mcu
node_mcu -->|"POST spectral JSON\nover HTTP / serial"| node_ingest
node_browser -->|"GET results"| node_wsgi
node_browser -->|"loads UI"| node_template
node_template -->|"styles"| node_style
node_manage_py -->|"configures"| node_settings
node_wsgi -->|"loads"| node_settings
node_settings -->|"routes"| node_project_urls
node_project_urls -->|"includes"| node_app_urls
node_app_urls -->|"dispatches"| node_ingest
node_ingest -->|"raw values"| node_calibration
node_calibration -->|"loads ref"| node_calib_file
node_calibration -->|"normalized values"| node_analyze
node_analyze -->|"returns"| node_json
node_json -->|"response"| node_browser
node_ingest -->|"persists"| node_models
node_models -->|"stores"| node_db
node_requirements -->|"supports"| node_settings

classDef toneHardware fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a

class node_sensor,node_mcu toneHardware
class node_manage_py,node_settings,node_project_urls,node_wsgi toneAmber
class node_app_urls,node_ingest,node_analyze,node_calibration,node_models toneMint
class node_template,node_style toneRose
class node_db,node_calib_file toneIndigo
class node_browser toneBlue
class node_json,node_requirements toneNeutral