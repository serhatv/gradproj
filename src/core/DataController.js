const axios = require('axios');

class DataController {
  constructor({ url }) {
    this.base = url;
  }

  async getCurrentStock() {
    try {
      const url = `${this.base}/stock`;
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getFillRate() {
    try {
      const url = `${this.base}/fillRate`;
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getLayout(depotId) {
    try {
      const url = `${this.base}/GetLayout`;
      const res = await axios.get(url, {
        params: {
          code: "HAzwypx06J1lLS6FgP2C3luLW3QE/U/iY0UVxHNf0DaXmondvohgIQ==",
          Depot_Id: depotId
        }
      });
      return {
        fillRate: res.data.DepoDoluluk,
        data: res.data.info
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCategories(depotId) {
    try {
      const url = `${this.base}/GetCategories`;
      const res = await axios.get(url, {
        params: {
          code: "DVEIM74Odx9tmHUaTQC9Vw5sn8vh11nUDgKCyaQAEDmZsLyceTjP4g==",
          Depot_Id: depotId
        }
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async updateStock(depotId, opType, loc, amount, productId) {
    try {
      const url = `${this.base}/ManuelUpdate`;
      const res = await axios.get(url, {
        params: {
          code: "uaI9TYr/kdNy9twvBkzDZcP8gE0STPrDufxUKAyZ3Iwtj58sDrsOKg==",
          Depot_Id: depotId,
          OperationType: opType,
          Location: loc,
          KoliMiktari: amount,
          ProductId: productId
        }
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getLocHistory(depotId, loc, startDate, endDate) {
    try {
      const url = `${this.base}/GetLocHistory`;
      const res = await axios.get(url, {
        params: {
          code: "oAYBeb0JJQr1fDBA9SkauwGsQA7hNNSOnbtipjyTxNnrY09lgmpxKw==",
          Depot_Id: depotId,
          Location: loc,
          "Date-LowerBound": startDate,
          "Date-UpperBound": endDate
        }
      });
      return res.data.info;
    } catch (error) {
      console.log(error);
    }
  }


  async getRouting(depotId, startDate, endDate) {
    try {
      const url = `${this.base}/GetRotalama`;
      const res = await axios.get(url, {
        params: {
          code: "deFxLoH0y6HuaAxjAb1xA9he8aag0Wri2pQ3t4u89YraCgOiF5TCaw==",
          Depot_Id: depotId,
          "Date-LowerBound": startDate,
          "Date-UpperBound": endDate
        }
      });

      return res.data.map((sol) => {
        return {
          origLen: sol.OrigLen,
          optLen: sol.FoundLen,
          pickupLocs: sol.OrigOrder,
          origPath: sol.OrigPath,
          optPath: sol.FoundPath,
          name: sol.OrderId
        }
      });

    } catch (error) {
      throw error;
    }
  }

  async uploadNewLayout(depotId, file) {
    try {
      const url = `${this.base}/InsertLayout`;
      let formData = new FormData()
      formData.append('Depot_Id', depotId)
      formData.append('layout', file, file.name)

      const res = await axios({
        method: 'post',
        url,
        data: formData,
        params: {
          code: "6mwa4yhvCbwyc6UONSZAUqkwv4O2v4C0/rT5HAOgTvbku5a/WtRicA==",
          Depot_Id: depotId
        },
        headers: {
          "Content-type": "multipart/form-data",
        }
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  
  async uploadReplenishmentData(depotId, file) {
    try {
      const url = `${this.base}/InsertOrders`;
      let formData = new FormData()
      formData.append('depo_id', depotId)
      formData.append('orders', file, file.name)

      const res = await axios({
        method: 'post',
        url,
        data: formData,
        params: {
          code: "MfjinlHDMj9c5bSChuLmqQRvQcKWAl4GAYCdjn1hNkoiDl9Q4yHrmw==",
          depo_id: depotId
        },
        headers: {
          "Content-type": "multipart/form-data",
        }
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async filterLayout(depotId, filters, weight_filters, product_filters) {
    try {
      const url = `${this.base}/PlacementFilter`;
      const res = await axios.get(url, {
        params: {
          code: "R6RlRGdvkT8kY/ztnaBWwo0ZI9l3knvctkcBY7cRBDKSCIAwkjYaIw==",
          Depot_Id: depotId,
          Filters: filters.join(","),
          Product_Category: product_filters ? product_filters.join(",") : "",
          Product_Weight: weight_filters ? weight_filters.join(",") : ""
        }
      });
      return {
        fillRate: res.data.DepoDoluluk,
        data: res.data.Info
      }
    } catch (error) {
      console.log(error);
    }
  }


  async getDepotInfo() {
    try {
      const url = `${this.base}/depotInfo`;
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getDepots() {
    try {
      const url = `${this.base}/GetDepots`;
      const res = await axios.get(url, {
        params: {
          code: "F0aJNaES2qvRS1S6MGECqOk8asL61LkBnzjVgK3eKdOaomF5zyGH4A=="
        }
      });
      return res.data.info;
    } catch (error) {
      console.log(error);
    }
  }
}

export default DataController;