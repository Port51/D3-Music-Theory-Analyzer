# D3 Music Theory Analyzer, version 1.03

This is a front end app that takes notes as input, finds similar modes/scales according to settings, and outputs an interactive graph showing results. I made this using JavaScript and [D3.js](https://d3js.org/), a great library for data visualization.

Scales are cool and can give compositions amazing, unique feels. Sure, you can derive everything from harmony if you know what you're doing, but you can also have fun composing with scales!

This app helps you discover more scales that are similar to ones you already like. It also works if you only know a few notes / chords that you want to use. Just set the "completeness" setting to low and the algorithm will fill in the gaps.

__Intended use:__
* Find usable modes for chord progressions
* Find modes that align with melodies
* Identify if user-made modes have been invented before

This is most useful for film-style music, where you can experiment with unique modes to get interesting tones. While the app does show perfect matches, the focus is displaying a range of options so composers can discover modes that are similar enough to use.

# Design process

There were two huge obstacles making this project.

#1: This is a very DISCRETE problem. If you move 1 note by 1 semitone (example: moving C to C#), the result can be minor or completely change the tone of the scale. It depends on all the other notes.

#2: It was easy to over-tune based on test cases. I found that almost any algorithm that I tried could be fitted very well to a good number of scales... and then be wrong for another set of scales. Eventually, I learned to use test inputs long enough to solve problems, but to then immediately switch to new inputs once they were solved to avoid overtuning.

I ended up simplifying the algorithm and cutting features. In the future, I'd very much like to work with composers more experienced than myself to improve the algorithm. It seems like the missing piece is the harmony derived from the scales, as I don't have much experience with harmony beyond the normal chord knowledge that any composer has.

Currently, it determines how similar 2 scales are by analyzing the following:

* Are the roots the same?
* Are the roots included in both scales?
* How many notes are added/removed?
* Statistics are taken for each type of interval. How do those statistics compare?
* Interval "regions" are compared. How similar are those regions?
* "Happiness/sadness" is calculated and compared, according to custom rules
* "Bittersweetness" is calculated and compared, according to custom rules

Each of those is a single module, which is fed parameters based on user parameters.

The main user parameter is how "complete" their input scale is. To set module parameters for this, I created test cases of very complete/incomplete inputs and tuned the modules to give good results for them. This gave me some data points to lerp between.

The "regions" are a bit hard to explain. Let's take the 3rds as an example. You can have a major 3rd, minor 3rd, both 3rds, or no 3rds. That result is compared against the other scale. Then the "regions" are weighted so that 3rds are very important and 2nds are not so important.

# Todo list
* Algorithm development
  * ~~Take chords as inputs?~~
  * ~~Optimize search~~
  * ~~Finish adding modules (factors for similarity score)~~
  * ~~Test with other composers~~
  * ~~Finish layered graph preparation~~

* Graph
  * ~~Define starting locations of nodes~~
  * ~~Pop-up window with info when click nodes~~
  * ~~Smaller piano showing notes when clicked~~
  * ~~Chord list~~

* UX
  * Ability to download PNG
  * Ability to download text describing any mode selected
  * ~~Labels each end of sliders~~
  * ~~Better looking sliders~~
  * ~~Hover effects for keys and root selection~~

