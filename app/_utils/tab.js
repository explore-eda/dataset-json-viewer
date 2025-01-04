export default class Tab {
  constructor(datasetName, dataset, dataSource, dataType, sourceType, newLimit) {
    this.tabUUID = Date.now();
    this.dataSource = dataSource;
    this.displayApi = dataSource;
    this.datasetOID = datasetName;
    this.dataset = dataset;
    this.type = dataType;
    this.sourceType = sourceType;

    this.sortFilters = [];
    this.useLabels = false;
    this.visibleColumns = dataset?.columns ?? [];
    this.rowConfig = [];
    this.rowQuery = "";

    this.paginationActive = true;
    this.page = 0;
    this.total = dataset.pagination?.total ?? dataset.rows?.length ?? 0;
    this.limit = newLimit ?? 10;
    this.totalPages = dataset.pagination
      ? Math.ceil(dataset.pagination.total / this.limit)
      : 0;
  }

  setDataset(newDataset) {
    this.dataset = newDataset;
  }

  setVisibleColumns(newColumns) {
    this.visibleColumns = newColumns;
  }

  updateUseLabels(useLabels) {
    this.useLabels = useLabels;
  }

  updateDisplayApi(api) {
    this.displayApi = api;
  }

  updateRowQuery(query, config) {
    this.rowQuery = query;
    this.rowConfig = config;
  }

  setPage(newPage) {
    const page = Math.min(newPage, this.totalPages - 1);
    this.page = page;
  }

  setLimit(newLimit) {
    this.limit = newLimit;
    this.totalPages = Math.ceil(this.total / newLimit);
  }

  setSortFilters(newSortFilters) {
    this.sortFilters = newSortFilters;
  }
}
