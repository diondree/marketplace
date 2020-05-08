import { Cloudinary as CoreCloudinary, Util } from 'cloudinary-core';

export const url = (publicId: string, options: any) => {
  const scOptions = Util.withSnakeCaseKeys(options);
  const cl = CoreCloudinary.new({});
  return cl.url(publicId, scOptions);
};

export const openUploadWidget = (options: any, callback: Function) => {
  const scOptions = Util.withSnakeCaseKeys(options);
  //@ts-ignore
  window.cloudinary.openUploadWidget(scOptions, callback);
};

export async function fetchPhotos(imageTag: any, setter: Function) {
  const options = {
    cloudName: 'emkaydee',
    format: 'json',
    type: 'list',
    version: Math.ceil(new Date().getTime() / 1000),
  };

  const urlPath = url(imageTag.toString(), options);

  fetch(urlPath)
    .then((res) => res.text())
    .then((text) =>
      text
        ? setter(
            JSON.parse(text).resources.map((image: any) => image.public_id)
          )
        : []
    )
    .catch((err) => console.log(err));
}

// export const beginUpload = tag => {
//   const uploadOptions = {
//     cloudName: "emkaydee",
//     tags: [tag],
//     uploadPreset: "upload"
//   };

//   openUploadWidget(uploadOptions, (error, photos) => {
//     if (!error) {
//       console.log(photos);
//       if(photos.event === 'success'){
//         setImages([...images, photos.info.public_id])
//       }
//     } else {
//       console.log(error);
//     }
//   })
// }
