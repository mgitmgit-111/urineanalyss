flowchart TD

subgraph group_hw["Hardware layer — optical enclosure"]
  node_enclosure["Light-tight enclosure\nfixed LED + geometry"]
  node_cradle["Strip cradle\n±0.5mm tolerance dock"]
  node_sensor(("AS7265x / Hamamatsu\n18-channel spectral sensor"))
  node_thermistor["Thermistor\ntemperature compensation"]
  node_mcu["MCU / Raspberry Pi\nsensor_reader.py"]
end

subgraph group_cal["Calibration layer — every power-on"]
  node_dark["Dark current read\nLED off + light trap"]
  node_white["White tile reference\nPTFE Spectralon"]
  node_lot["Lot calibration\nscan strip barcode"]
  node_tempcomp["Temperature correction\nlookup table"]
end

subgraph group_ingest["Django ingest — PostgreSQL backend"]
  node_session["ReadingSession\noperator + lot + sensor serial"]
  node_rawstore["Raw channel store\nimmutable audit record"]
  node_norm["Normalize\nraw ÷ white ref − dark"]
end

subgraph group_ml["ML analysis layer"]
  node_ood["OOD detector\nflag unknown spectra"]
  node_classifier["Per-pad RF/SVM classifier\ntrained on 2000+ samples per level"]
  node_confidence["Confidence scorer\nreject below threshold"]
end

subgraph group_output["Result layer"]
  node_result["Structured result\npad + level + confidence"]
  node_inconclusive{{"Confidence\nabove threshold?"}}
  node_flag["Flag inconclusive\nrepeat or refer"]
  node_finalresult["Final clinical result\nURO BIL KET BLD PRO NIT LEU GLU SG"]
end

subgraph group_reporting["Reporting + integration"]
  node_lis["LIS export\nHL7 / ASTM E1394"]
  node_dashboard["Clinician dashboard\nresults.html"]
  node_audit["Audit log\nimmutable + versioned"]
end