flowchart TD

subgraph group_client["Client"]
  node_browser(("Browser<br/>client"))
end

subgraph group_project["Django project"]
  node_manage_py["manage.py<br/>entrypoint<br/>[manage.py]"]
  node_settings["settings<br/>config<br/>[settings.py]"]
  node_project_urls["project urls<br/>router<br/>[urls.py]"]
  node_asgi["asgi.py<br/>deployment<br/>[asgi.py]"]
  node_wsgi["wsgi.py<br/>deployment<br/>[wsgi.py]"]
end

subgraph group_app["strip_analyzer"]
  node_app_urls["app urls<br/>router<br/>[urls.py]"]
  node_views["analyze_strip<br/>view<br/>[views.py]"]
  node_models["models<br/>[models.py]"]
end

subgraph group_assets["UI assets"]
  node_template["home.html<br/>template<br/>[home.html]"]
  node_style["style.css<br/>stylesheet<br/>[style.css]"]
end

subgraph group_data["Local state"]
  node_db[("db.sqlite3<br/>sqlite store<br/>[db.sqlite3]")]
  node_strip_images["strip_images<br/>image storage"]
end

node_opencv{{"OpenCV<br/>image-processing"}}
node_json["JSON response<br/>api payload"]
node_requirements["requirements<br/>dependencies<br/>[requirements.txt]"]

node_browser -->|"HTTP request"| node_wsgi
node_browser -->|"loads UI"| node_template
node_template -->|"styles"| node_style
node_manage_py -->|"configures"| node_settings
node_asgi -->|"loads"| node_settings
node_wsgi -->|"loads"| node_settings
node_settings -->|"routes"| node_project_urls
node_project_urls -->|"includes"| node_app_urls
node_app_urls -->|"dispatches"| node_views
node_views -->|"analyzes"| node_opencv
node_views -->|"returns"| node_json
node_json -->|"response"| node_browser
node_views -->|"uses"| node_strip_images
node_views -.->|"optional persistence"| node_models
node_models -.->|"stores"| node_db
node_requirements -->|"supports"| node_settings

click node_manage_py "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/manage.py"
click node_settings "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/UrineStripAnalyzer/settings.py"
click node_project_urls "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/UrineStripAnalyzer/urls.py"
click node_asgi "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/UrineStripAnalyzer/asgi.py"
click node_wsgi "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/UrineStripAnalyzer/wsgi.py"
click node_app_urls "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/strip_analyzer/urls.py"
click node_views "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/strip_analyzer/views.py"
click node_models "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/strip_analyzer/models.py"
click node_template "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/templates/home.html"
click node_style "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/static/css/style.css"
click node_db "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/db.sqlite3"
click node_strip_images "https://github.com/sanket-ugale/urinestripanalyzer/tree/main/strip_images"
click node_requirements "https://github.com/sanket-ugale/urinestripanalyzer/blob/main/requirements.txt"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_browser toneBlue
class node_manage_py,node_settings,node_project_urls,node_asgi,node_wsgi toneAmber
class node_app_urls,node_views,node_models toneMint
class node_template,node_style toneRose
class node_db,node_strip_images toneIndigo
class node_opencv,node_json,node_requirements toneNeutral