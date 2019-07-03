# 2019.07.01

The idea behind this small bot is to create a self-destruction program; a software that'll pick an Image on Twitter and alter the image styling based on it's metadata ( = attached hidden data). I've been working on this project on/off for quite some time now. Through this project I came accross three different paths/concepts I still find valuable and I'ld like to explain further:

1. **Custom Filters**

   First idea I had for this project.  Accessing the metadata from the image, all the numerical data are stored. Two of them are then used as inputs to modify the image using [JIMP](https://www.npmjs.com/package/jimp)'s: saturate and blur filters. The image is then posted on the Twitter Account labelled with the stored numbers. Visually, I love it; I love the blur and the overall aesthetics this idea creates. I also like the association between numbers and abstract images, the whole thing create a cryptic/weird object.

   ------

   However, why these two filters and not others? I feel that this is more aesthetically-driven than conceptually-driven. Maybe use all filters? Or a set of filters randomly picken? How do Instagram filters works? Should I keep working with JIMP or work with CSS filters?

   

   ![](https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1540331301/5_ht8kln.jpg) 

   

   ![](https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1540331245/3_uaf6gx.jpg)   

   ![](https://res.cloudinary.com/www-c-t-l-k-com/image/upload/v1540331116/4_hlapdp.jpg)

2. **RGB values**

   The idea behind this iteration is to use the number of comments, retweets and like attached to the image as the only inputs used to alter the image. Using these data makes more sense in the context of creating an self-destruction program and is, in my opinion, stronger than using any data from the metadata.

   I've changed the source code from the first ^ iteration to this one. JIMP has a method to change the color balance of the image and  its Red, Blue, Green values (RGB()) and I'm now using the API like this:

       Jimp.read(selectedEle.elePath)
           .then(img => {
             return img
             .color([{ apply: 'red', params: [selectedEle.eleLikes] }])
             .color([{ apply: 'green', params: [selectedEle.eleRetweets] }])
             .color([{ apply: 'blue', params: [selectedEle.eleCommentCounts]}])
             .resize(600, 600)
               .write('altered-img.jpg');
           })
           .catch(err => {
             console.error(err);
           })
   Here, the red layer is altered by the number of likes, the green one by the number of retweets and the blue one by the number of comments and replies. As a label, I'm attaching the 

   