// Load HTML templates
$(function() {
    $(".loadTemplate").each(function(){
        $(this).load($(this).attr('value'), function() {
            // Call some functions right after loading, based on what model window was loaded
            const onloadAction = $(this).attr('onload');
            if (onloadAction == "pianoButtons") {
                setRootSelectColors();
                setPianoInputFunctions();
            } else if (onloadAction == "sliderButtons") {
                setSliderInputFunctions();
            } else if (onloadAction == "instructionsButtons") {
                setInstructionsInputFunctions();
            }
        });
    });
});
