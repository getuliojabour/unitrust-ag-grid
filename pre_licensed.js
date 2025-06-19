// Define um getter/setter com console.log sempre que window.baseShop for atualizado
Object.defineProperty(window, "baseShop", {
  set: function (value) {
    console.log("✅ baseShop atualizado:", value);
    this._baseShop = value;
  },
  get: function () {
    return this._baseShop;
  }
});

// Valor inicial (vazio ou vindo do Bubble)
window.baseShop = [];

// Formata percentuais
function percentFormatter(params) {
  return params.value != null ? params.value + "%" : "-";
}

// Formata datas
function dateFormatter(params) {
  if (!params.value) return "-";
  const d = new Date(params.value);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-US");
}

// Atualiza total e selecionados
function updateCountDisplay(api) {
  let total = 0;
  api.forEachNodeAfterFilterAndSort((node) => {
    if (!node.group) total++;
  });
  const selCount = api.getSelectedNodes().filter((n) => !n.group).length;
  document.getElementById("totalCount").textContent = total;
  document.getElementById("selectedCount").textContent = selCount;
}

const gridOptions = {
  // Coluna automática de agrupamento
  autoGroupColumnDef: {
    headerName: "Base Shop",
    flex: 1,
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: (params) => {
        const name = params.value;
        const count = params.node.allChildrenCount;
        if (params.node.level === 0) {
          return `Base Shop: ${name} (${count})`;
        }
        return name;
      },
    },
  },
  // Demais colunas
  columnDefs: [
    {
      headerName: "UFG",
      field: "ufg",
      filter: "agSetColumnFilter",
      sortable: true,
    },
    {
      headerName: "Pre-License Enrollment",
      field: "preLicenseEnrollment",
      filter: "agSetColumnFilter",
      sortable: true,
    },
    {
      headerName: "Licensed",
      field: "licensed",
      filter: "agSetColumnFilter",
      sortable: true,
    },
    {
      headerName: "Pre-License %",
      field: "preLicensePercent",
      valueFormatter: percentFormatter,
      cellClass: "number-cell",
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Finish Date",
      field: "finishDate",
      valueFormatter: dateFormatter,
      cellClass: "date-cell",
      filter: "agDateColumnFilter",
      sortable: true,
    },
  ],
  defaultColDef: {
    sortable: true,
    filter: true,
    resizable: true,
  },
  rowData: window.baseShop,
  treeData: true,
  animateRows: true,
  groupDefaultExpanded: 1,
  getDataPath: (data) => data.hierarchyPath,
  rowSelection: "multiple",
  suppressRowClickSelection: true,
  onGridReady: (params) => {
    const api = params.api;
    api.autoSizeAllColumns();
    window.addEventListener("resize", () => api.autoSizeAllColumns());
    updateCountDisplay(api);

    document.getElementById("exportCsv").onclick = () =>
      api.exportDataAsCsv({ fileName: "export.csv" });
    document.getElementById("expandAll").onclick = () =>
      api.forEachNode((n) => n.setExpanded(true));
    document.getElementById("collapseAll").onclick = () =>
      api.forEachNode((n) => n.setExpanded(false));
    document.getElementById("clearFilters").onclick = () =>
      api.setFilterModel(null);
  },
  onSelectionChanged: (params) => updateCountDisplay(params.api),
};

// Inicializa a grid
document.addEventListener("DOMContentLoaded", () => {
  const eGridDiv = document.querySelector("#myGrid");
  agGrid.createGrid(eGridDiv, gridOptions);
});
