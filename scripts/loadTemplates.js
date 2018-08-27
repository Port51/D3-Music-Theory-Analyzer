// Load HTML templates
$(function() {
    $(".loadTemplate").each(function(){
        $(this).load($(this).attr('value'), function() {
            // Call some functions right after loading
            const onloadAction = $(this).attr('onload');
            if (onloadAction == "pianoButtons") {
                setRootSelectColors();
                setPianoInputFunctions();
            } else if (onloadAction == "sliderButtons") {
                setSliderInputFunctions();
            }
        });

    });
});
