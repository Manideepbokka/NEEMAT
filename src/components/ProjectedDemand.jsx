import React from "react";
import { CloudUpload } from "lucide-react";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import useAppStore from "../useAppStore";
import Georgia from "../assets/Georgia.svg";
import California from "../assets/California.svg";
import Seattle from "../assets/Seattle.svg";
import NewYork from "../assets/NewYork.svg";
import "handsontable/dist/handsontable.full.min.css";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import "handsontable/styles/ht-theme-horizon.css";
import VehicleStepper from "./VerticalStepper";

registerAllModules();
function ProjectedDemand({ activeStep }) {
  const classificationState = useAppStore((s) => s.classificationState);
  const penetrationState = useAppStore((s) => s.penetrationState);
  const projectedDemandState = useAppStore((s) => s.projectedDemandState);
  const setProjectedDemandState = useAppStore((s) => s.setProjectedDemandState);

  const loadSheet = (file, keyHeaders, keyData) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const wb = file.name.endsWith(".csv")
        ? XLSX.read(data, { type: "string" })
        : XLSX.read(data, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (parsed.length)
        setProjectedDemandState({
          [keyHeaders]: parsed[0],
          [keyData]: parsed.slice(1),
        });
      else setProjectedDemandState({ [keyHeaders]: [], [keyData]: [] });
    };
    file.name.endsWith(".csv")
      ? reader.readAsText(file)
      : reader.readAsBinaryString(file);
    setProjectedDemandState({
      [file === projectedDemandState.projectedTrafficVolumeFile
        ? "projectedTrafficVolumeFile"
        : "projectedTrafficVolumeFile"]: file,
    });
  };

  const statesList = ["", "Georgia", "California", "Seattle", "NewYork"];
  const cityImages = { Georgia, California, Seattle, NewYork };
  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      <div className="flex flex-col gap-6">
        <form className="flex items-end gap-4 p-4 shadow rounded">
          <label className="flex items-center bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
            <span className="mr-2">Upload</span> Projected Traffic Volume Data
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) =>
                loadSheet(
                  e.target.files[0],
                  "projectedTrafficVolumeHeaders",
                  "projectedTrafficVolumeData"
                )
              }
              className="hidden"
            />
          </label>

          <select
            value={penetrationState.projectedYear}
            disabled
            className="border rounded px-2 py-1 w-20 h-[32px]"
          >
            {classificationState.baseYear &&
              Array.from(
                { length: 6 },
                (_, i) => parseInt(classificationState.baseYear) + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>

          <select
            value={classificationState.city}
            disabled
            className="border rounded px-2 py-1 w-25"
          >
            <option value="">City</option>
            {statesList.slice(1).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </form>
        {projectedDemandState.projectedTrafficVolumeData.length ? (
          <HotTable
            className="min-w-[60%] overflow-auto ht-theme-main-dark"
            style={{ minHeight: 500 }}
            data={projectedDemandState.projectedTrafficVolumeData}
            colHeaders={projectedDemandState.projectedTrafficVolumeHeaders}
            rowHeaders
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
          />
        ) : (
          <div className="min-w-[60%] ht-theme-main-dark flex items-center justify-center h-[500px] text-gray-500">
            No data
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <VehicleStepper activeStep={activeStep} />
        {classificationState.city && (
          <img
            src={cityImages[classificationState.city]}
            alt={classificationState.city}
            className="w-full h-[500px] object-contain rounded shadow-lg"
          />
        )}
      </div>
    </div>
  );
}

export default ProjectedDemand;
