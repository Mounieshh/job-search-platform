import { type ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";

type CarRow = {
    make: string;
    model: string;
    price: number;
    electric: boolean;
};

export default function AgDataGridExample() {
    const [rowData] = useState<CarRow[]>([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);

    const [colDefs] = useState<ColDef<CarRow>[]>([
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "electric" }
    ]);

    return (
        <div className="ag-theme-alpine" style={{ height: 400 }}>
            <AgGridReact<CarRow>
                rowData={rowData}
                columnDefs={colDefs}
            />
        </div>
    );
}