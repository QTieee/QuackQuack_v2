const postAction = require("../actions/post");
const sleep = require("./sleep");
const config = require("../config.json");
const addLog = require("./addLog");

async function hatchEgg(token, ua, nest_id) {
  let retry = 0;
  let data = null;
  while (retry < config.retryCount) {
    if (!!data) {
      break;
    }
    data = await hatchEggInternal(token, ua, nest_id);
    retry++;
  }

  return data;
}

async function hatchEggInternal(token, ua, nest_id) {
  try {
    const response = await postAction(
      token,
      "nest/hatch",
      "nest_id=" + nest_id,
      ua
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    // console.log("hatchEgg error");
    if (error.response) {
      // console.log(error.response.data);
      console.log("status", error.response.status);
      // console.log("data", error.response.data);
      const status = error.response.status;
      // console.log(error.response.headers);

      addLog(`hatchEggInternal error ${status}`, "error");

      if (status >= 500) {
        console.log("Lost connect, auto connect after 5s, retry to die");
        await sleep(5);
        return null;
      } else if (status === 401) {
        console.log(`\nToken loi hoac het han roi\n`);
        process.exit(1);
      } else if (status === 400) {
        return error.response.data;
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

module.exports = hatchEgg;
