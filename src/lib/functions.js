export function POST(body) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export function resizeImage(base64Str, maxWidth = 400, maxHeight = 350) {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      const MAX_WIDTH = maxWidth;
      const MAX_HEIGHT = maxHeight;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
  });
}

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export function sortByNumber(a, b) {
  if (a.number > b.number) {
    return -1;
  }
  if (a.number < b.number) {
    return 1;
  }
  return 0;
}

export function roundWithTwoDecimals(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export let storageSpace = {
  /* total: 0, */
  usage: 0,
  /* percentage: 0, */
};

function totalStorage() {
  var countKey, countValue, itemLength;
  var occupied = 3;
  var i = 0;
  while (!error) {
    try {
      localStorage.setItem(
        "testKey" + i,
        "11111111112222222222333333333344444444445555555555666661111111111222222222233333333334444444444555555555566666"
      );
    } catch (e) {
      var error = e;
    }
    i++;
  }
  if (error) {
    for (var i = 0; i < localStorage.length; i++) {
      countKey = localStorage.key(i);
      countValue = localStorage.getItem(localStorage.key(i));
      itemLength = countKey.length + countValue.length;
      occupied = occupied + itemLength;
    }
    occupied = roundWithTwoDecimals((occupied * 16) / (8 * 1024));

    Object.keys(localStorage).forEach(function (key) {
      if (key.indexOf("testKey") !== -1) {
        localStorage.removeItem(key);
      }
    });
  }

  return occupied;
}

if (process.browser) {
  /* storageSpace.total = totalStorage(); */
  storageSpace.usage = roundWithTwoDecimals(
    new Blob(Object.values(localStorage)).size / 1024
  );
  /* storageSpace.percentage = roundWithTwoDecimals((storageSpace.usage / storageSpace.total) * 100); */
}
