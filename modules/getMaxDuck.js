const getAction = require("../actions/get");
const sleep = require("./sleep");
const config = require("../config.json");
const addLog = require("./addLog");

async function getMaxDuck(token, ua) {
  let retry = 0;
  let data = null;
  while (retry < config.retryCount) {
    if (!!data) {
      break;
    }
    data = await getMaxDuckInternal(token, ua);
    retry++;
  }

  return data;
}

async function getMaxDuckInternal(token, ua) {
  try {
    const response = await getAction(token, "nest/max-duck", ua);
    // console.log("getMaxDuck", response);
    return response.data;
  } catch (error) {
    console.log("getMaxDuck error");
    if (error.response) {
      // console.log(error.response.data);
      console.log("status", error.response.status);
      // console.log("data", error.response.data);
      const status = error.response.status;
      // console.log(error.response.headers);

      addLog(`getMaxDuckInternal error ${status}`, "error");

      if (status >= 500) {
        console.log("Lost connect, auto connect after 5s, retry to die");
        await sleep(5);
        return null;
      } else if (status === 401) {
        console.log(`\nToken loi hoac het han roi\n`);
        process.exit(1);
      } else if (status === 400) {
        console.log("data", error.response.data);
        console.log("Lost connect, auto connect after 3s, retry to die");
        await sleep(3);
        return null;
      } else {
        console.log("Lost connect, auto connect after 3s, retry to die");
        await sleep(3);
        return null;
      }
    } else if (error.request) {
      console.log("request", error.request);
      console.log("Lost connect, auto connect after 3s, retry to die");
      await sleep(3);
      return null;
    } else {
      console.log("error", error.message);
      console.log("Lost connect, auto connect after 3s, retry to die");
      await sleep(3);
      return null;
    }
  }
}

module.exports = getMaxDuck;
