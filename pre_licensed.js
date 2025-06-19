// Seus dados (adicione aqui todos os seus registros)
const mockData = [
  {
    ufg: "UFG230853",
    name: "Aaliyah Coats",
    image: null,
    preLicenseEnrollment: "Yes",
    preLicensePercent: 0,
    finishDate: null,
    licensed: "No",
    hierarchyPath: ["Peter Beckman", "Aaliyah Coats"],
  },
  {
    ufg: "UFG227096",
    name: "Aaliyah Reese",
    image: null,
    preLicenseEnrollment: "No",
    preLicensePercent: 0,
    finishDate: null,
    licensed: "No",
    hierarchyPath: ["Peter Beckman", "Aaliyah Reese"],
  },
  {
    ufg: "UFG228526",
    name: "Aamirah Semple",
    image: null,
    preLicenseEnrollment: "Yes",
    preLicensePercent: 0,
    finishDate: null,
    licensed: "No",
    hierarchyPath: ["Peter Beckman", "Aamirah Semple"],
  },
  {
    ufg: "UFG211932",
    name: "Aanya Bennett -ADMIN",
    image:
      "//4681fae44a74582adad5b889aa1a3671.cdn.bubble.io/d200/f1745929223625x422744127792902900/_DSC2452.jpg?fit=facearea&facepad=8&q=75",
    preLicenseEnrollment: "Yes",
    preLicensePercent: 93,
    finishDate: null,
    licensed: "No",
    hierarchyPath: ["Peter Beckman", "Aanya Bennett -ADMIN"],
  },
  {
    ufg: "UFG226170",
    name: "Adam McIntyre",
    image:
      "//4681fae44a74582adad5b889aa1a3671.cdn.bubble.io/d200/f1739479725723x626495677754531500/this%20one1.jpg?fit=facearea&facepad=8&q=75",
    preLicenseEnrollment: "Yes",
    preLicensePercent: 97,
    finishDate: "2025-02-11T06:00:00.000Z",
    licensed: "Yes",
    hierarchyPath: ["Peter Beckman", "Adam McIntyre"],
  },
];

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
        const name = params.value; // ex: “Peter Beckman”
        const count = params.node.allChildrenCount;
        // nível 0 === pai (primeiro nível de agrupamento)
        if (params.node.level === 0) {
          return `Base Shop: ${name} (${count})`;
        }
        // níveis filhos ficam só com o nome
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
  rowData: mockData,
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
