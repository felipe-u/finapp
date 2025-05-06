module.exports = {
  // App
  SERVER_STARTED: (port) => `Server is running on port ${port}`,
  MONGODB_CONNECTED: "MongoDB connected successfully",
  MONGODB_CONNECTION_ERROR: "Connection error with the database",

  // Images
  DELETE_RESULT: (result) => `Delete result: ${result}`,
  DELETE_FAIL: (imageUrl) => `Failed to delete ${imageUrl}`,

  // Virtual Date
  SET_VIRTUAL_DATE: "Virtual Date set at 2025/01/01",
  SET_VIRTUAL_DATE_ERROR: "Error setting virtual date...",
  SIM_DATE: (date) => `Simulated date: ${date}`,
  SIM_USER_CREATED: "Simulated client created",
  INST_PAID: "Installment paid",
  INST_NOT_PAID: "Installment not paid",
  VIRTUAL_DATE_RESET: "Virtual date restarted",
  SIM_DATA_DELETED: "Simulated data deleted",
  SIM_DATA_DELETED_ERROR: "Error deleting simulated data...",
  USER_CREATE_ERROR: (error) => `Error creating user: ${error}`,
};
