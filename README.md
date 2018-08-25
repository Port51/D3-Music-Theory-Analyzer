# D3 Music Theory Analyzer
__NOTE:__ This is a work-in-progress project!

This is a front end app that takes notes as input, finds similar modes/scales according to settings, and outputs an interactive graph showing results.

__Intended use:__
* Find usable modes for chord progressions
* Find modes that align with melodies
* Identify if user-made modes have been invented before
* Allow users to map out modulations visually

This is most useful for film-style music, where you can experiment with unique modes to get interesting tones. While the app does show perfect matches, the focus is displaying a range of options so composers can discover modes that are similar enough to use.

# Todo list
* Algorithm development
  * Improve code structure
  * Optimize search
  * Finish adding modules (factors for similarity score)
  * Test with other composers
  * ~~Finish layered graph preparation~~

* Graph
  * ~~Define starting locations of nodes~~
  * Pop-up window with info when click nodes
    * Smaller piano showing notes
    * Chord list

* UX
  * Text input for mode name
  * ~~Labels each end of sliders~~
  * ~~Better looking sliders~~
  * ~~Hover effects for keys and root selection~~
  * Piano --> SVG instead of HTML elements

