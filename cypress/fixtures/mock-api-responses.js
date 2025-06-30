export const mockHealthResponse = {
  status: "OK"
}

export const mockDbResponse = {
  database: "Connected"
}

export const mockCollectionsResponse = {
  collections: [
    { collection: "test_collection", count: 100 },
    { collection: "covid19_data", count: 5000 }
  ],
  message: "Collections fetched successfully"
}

export const mockChartData = [
  { date_reported: "2024-01-01", new_cases: 1200 },
  { date_reported: "2024-01-02", new_cases: 1150 },
  { date_reported: "2024-01-03", new_cases: 1300 }
]