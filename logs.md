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
   Here, the red layer is altered by the number of likes, the green one by the number of retweets and the blue one by the number of comments and replies. As a label, I'm attaching the RGB() code concatenated with its numbers.

3. **Monitoring the same images** 

Will come back to this later.

# 2020.09.03


I'm going through Instagram filters now, and how these have been made/how these can be reproduced. I found this [CSS project called Instagram.css](https://picturepan2.github.io/instagram.css/), which basically translates all Instagram filters into `css codes`, so that these can be done within the browser.

------

Here's the repository where these (proprietary) filters are reproduced. I'm interested to see what kind of filters these are using. Here's the detail:

```
.filter-1977 {
  filter: sepia(.5) hue-rotate(-30deg) saturate(1.4);
}

.filter-aden {
  filter: sepia(.2) brightness(1.15) saturate(1.4);
}

.filter-amaro {
  filter: sepia(.35) contrast(1.1) brightness(1.2) saturate(1.3);
}

.filter-brannan {
  filter: sepia(.4) contrast(1.25) brightness(1.1) saturate(.9) hue-rotate(-2deg);
}

.filter-brooklyn {
  filter: sepia(.25) contrast(1.25) brightness(1.25) hue-rotate(5deg);
}

.filter-charmes {
  filter: sepia(.25) contrast(1.25) brightness(1.25) saturate(1.35) hue-rotate(-5deg);
}

.filter-clarendon {
  filter: sepia(.15) contrast(1.25) brightness(1.25) hue-rotate(5deg);
}

.filter-crema {
  filter: sepia(.5) contrast(1.25) brightness(1.15) saturate(.9) hue-rotate(-2deg);
}

.filter-dogpatch {
  filter: sepia(.35) saturate(1.1) contrast(1.5);
}

.filter-earlybird {
  filter: sepia(.25) contrast(1.25) brightness(1.15) saturate(.9) hue-rotate(-5deg);
}

.filter-gingham {
  filter: contrast(1.1) brightness(1.1);
}

.filter-ginza {
  filter: sepia(.25) contrast(1.15) brightness(1.2) saturate(1.35) hue-rotate(-5deg);
}

.filter-hefe {
  filter: sepia(.4) contrast(1.5) brightness(1.2) saturate(1.4) hue-rotate(-10deg);
}

.filter-helena {
  filter: sepia(.5) contrast(1.05) brightness(1.05) saturate(1.35);
}

.filter-hudson {
  filter: sepia(.25) contrast(1.2) brightness(1.2) saturate(1.05) hue-rotate(-15deg);
}

.filter-inkwell {
  filter: brightness(1.25) contrast(.85) grayscale(1);
}

.filter-juno {
  filter: sepia(.35) contrast(1.15) brightness(1.15) saturate(1.8);
}

.filter-kelvin {
  filter: sepia(.15) contrast(1.5) brightness(1.1) hue-rotate(-10deg);
}

.filter-lark {
  filter: sepia(.25) contrast(1.2) brightness(1.3) saturate(1.25);
}

.filter-lofi {
  filter: saturate(1.1) contrast(1.5);
}

.filter-ludwig {
  filter: sepia(.25) contrast(1.05) brightness(1.05) saturate(2);
}

.filter-maven {
  filter: sepia(.35) contrast(1.05) brightness(1.05) saturate(1.75);
}

.filter-mayfair {
  filter: contrast(1.1) brightness(1.15) saturate(1.1);
}

.filter-moon {
  filter: brightness(1.4) contrast(.95) saturate(0) sepia(.35);
}

.filter-nashville {
  filter: sepia(.25) contrast(1.5) brightness(.9) hue-rotate(-15deg);
}

.filter-perpetua {
  filter: contrast(1.1) brightness(1.25) saturate(1.1);
}

.filter-poprocket  {
  filter: sepia(.15) brightness(1.2);
}

.filter-reyes {
  filter: sepia(.75) contrast(.75) brightness(1.25) saturate(1.4);
}

.filter-rise {
  filter: sepia(.25) contrast(1.25) brightness(1.2) saturate(.9);
}

.filter-sierra {
  filter: sepia(.25) contrast(1.5) brightness(.9) hue-rotate(-15deg);
}

.filter-skyline {
  filter: sepia(.15) contrast(1.25) brightness(1.25) saturate(1.2);
}

.filter-slumber {
  filter: sepia(.35) contrast(1.25) saturate(1.25);
}

.filter-stinson {
  filter: sepia(.35) contrast(1.25) brightness(1.1) saturate(1.25);
}

.filter-sutro {
  filter: sepia(.4) contrast(1.2) brightness(.9) saturate(1.4) hue-rotate(-10deg);
}

.filter-toaster {
  filter: sepia(.25) contrast(1.5) brightness(.95) hue-rotate(-15deg);
}

.filter-valencia {
  filter: sepia(.25) contrast(1.1) brightness(1.1);
}

.filter-vesper {
  filter: sepia(.35) contrast(1.15) brightness(1.2) saturate(1.3);
}

.filter-walden {
  filter: sepia(.35) contrast(.8) brightness(1.25) saturate(1.4);
}

.filter-willow {
  filter: brightness(1.2) contrast(.85) saturate(.05) sepia(.2);
}

.filter-xpro-ii  {
  filter: sepia(.45) contrast(1.25) brightness(1.75) saturate(1.3) hue-rotate(-5deg);
}
```



Here, we can therefore see using a word occurence tool, that what Instagram uses most are the following filters.Then, the logic is to mix the likes, comments and reposts numbers of each image and use these are parameters in order to pipe them into a custom filter I will create *à la manière de* Instagram.


- `contrast()`, 37/40
- `brightness()`, 36/40
- `sepia()`, 35/40
- `saturate()`, 30/40





