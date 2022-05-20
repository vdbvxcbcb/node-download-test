const download = require('download')
const axios = require('axios')

let headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
}

function sleep(time) {
  return new Promise((reslove) => setTimeout(reslove, time))
}

async function load(skip = 0) {
  const data = await axios
    .get(
      'https://unsplash.com/napi/collections/1298463/photos',
      {
        headers,
        params: {
          per_page: 10, 
          order_by: "latest",
          page: skip + 1,
          share_key: "b1ebfb7cc607524c285c5afa3b9e52a5"
        },
      }
    )
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err)
    })
  await downloadFile(data)
  await sleep(3000)
  if (skip < 5) {
    load(skip + 1)
  } else {
    console.log('下载完成')
  }
}

async function downloadFile(data) {
  for (let index = 0; index < data.length; index++) {
    const item = data[index]
    // Path at which image will get downloaded
    const filePath = `${__dirname}/风景`

    await download(item.urls.small, filePath, {
      filename: item.id + '.jpeg',
      headers,
    }).then(() => {
      console.log(`Download ${item.id} Completed`)
      return
    })
  }
}

load()
