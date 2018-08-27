"use strict";

/* Panel vars */
var panel = {};
var panelLinks = {};

var resetD3Graph = (svg) => {
    svg.empty();
    svg.selectAll("*").remove();
    svg.append("rect").attr("x", "0").attr("y", "0").attr("width", "100%").attr("height", "100%").style("fill", "#000000");
}

var updateD3Panel = () => {
    panelLinks.title.text(panel.title);
    panelLinks.chords.text(panel.chords)
        .call(wrap, panelLinks.bounds.wi - 5);

    // Display notes
    if (panel.notes) {
        for (let i = 0; i < panel.notes.length; ++i) {
            let naturalColor = "";
            if (i == 1 || i == 3 || i == 6 || i == 8 || i == 10)
                naturalColor = "#222222";
            else
                naturalColor = "#eeeeee";

            let highlightColor = "";
            if (i == panel.key)
                highlightColor = "#20eeaa"; // root = greenish cyan
            else if ((panel.key + 6) % 12 == i || (panel.key + 7) % 12 == i)
                highlightColor = "#3090dd"; // root = blueish cyan
            else
                highlightColor = "#2020ee"; // all other notes = blue


            const color = panel.notes[i] ? highlightColor : naturalColor;

            // Set color
            panelLinks.piano.key[i].style("fill", color);

        }
    }
}

// User clicks on a node, and it magically appears to the right
var setPanelMode = (mode) => {
    panel.title = mode.name;
    panel.chords = mode.analysis.chordsText;
    panel.notes = mode.n;
    panel.key = mode.key;
    updateD3Panel();
}

// Get chords and such
var analyzeModeForPanel = (mode) => {
    let analysis = {};
    analysis.chords = determineChordsInMode(mode);
    analysis.chordsText = analysis.chords.join(' ');

    return analysis;
}

var createSVGPiano = (svg, panelRect, startY, pianoHei) => {
    let piano = {};
    const wi = panelRect.wi - 20;

    piano.base = svg.append("rect")
        .attr("x", panelRect.x0 + 10)
        .attr("y", panelRect.y0 + startY)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", wi)
        .attr("height", pianoHei)
        .style("fill", "#113388");

    // Key data
    piano.key = [];
    for (let i = 0; i < 12; ++i)
        piano.key.push(null);

    // Add white keys
    const internalPadding = 20;
    const whiteWi = (wi - internalPadding * 2) / 7;
    for (let i = 0; i < 7; ++i) {

        // Map to noteID
        let noteID = 0;
        if (i == 0) noteID = 0;
        else if (i == 1) noteID = 2;
        else if (i == 2) noteID = 4;
        else if (i == 3) noteID = 5;
        else if (i == 4) noteID = 7;
        else if (i == 5) noteID = 9;
        else if (i == 6) noteID = 11;

        piano.key[noteID] = svg.append("rect")
            .attr("x", panelRect.x0 + 10 + internalPadding + whiteWi * i)
            .attr("y", panelRect.y0 + startY + 5)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("width", whiteWi - 1)
            .attr("height", pianoHei - 10)
            .style("fill", "#eeeeee")
            .style("stroke", "#101010");
    }

    // Add black keys over top
    const blackWi = whiteWi * 0.75;
    for (let i = 0; i < 5; ++i) {

        // Map to noteID
        let noteID = 0;
        let nearestWhite = 0;
        if (i == 0) {
            noteID = 1;
            nearestWhite = 0;
        }
        else if (i == 1) {
            noteID = 3;
            nearestWhite = 1;
        }
        else if (i == 2) {
            noteID = 6;
            nearestWhite = 3;
        }
        else if (i == 3) {
            noteID = 8;
            nearestWhite = 4;
        }
        else if (i == 4) {
            noteID = 10;
            nearestWhite = 5;
        }

        piano.key[noteID] = svg.append("rect")
            .attr("x", panelRect.x0 + 10 + internalPadding + whiteWi * nearestWhite + whiteWi * 0.5 + (whiteWi - blackWi) * 0.5)
            .attr("y", panelRect.y0 + startY + 5)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("width", blackWi)
            .attr("height", pianoHei - 40)
            .style("fill", "#222222")
            .style("stroke", "#101010");
    }

    return piano;
}

// Add panel showing selected mode
// TODO: Move styles to CSS
var createD3Panel = (svg, width, height) => {
    // Settings
    const padding = 10;
    let panelRect = {
        wi: 220, hei: 400,
        };
    panelRect.x0 = width - panelRect.wi - padding;
    panelRect.y0 = padding;
    panelRect.x1 = panelRect.x0 + panelRect.wi;
    panelRect.y1 = panelRect.y0 + panelRect.hei;
    panelLinks.bounds = panelRect;

    panelLinks.rect = svg.append("rect")
        .attr("x", panelRect.x0)
        .attr("y", panelRect.y0)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", panelRect.wi)
        .attr("height", panelRect.hei)
        .style("fill", "#5577cc");

    // MODE NAME
    panelLinks.title = svg.append("text")
        .attr("x", panelRect.x0 + panelRect.wi * 0.5)
        .attr("y", panelRect.y0 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "#fff");

    // MODE PIANO
    const pianoHei = 90;
    panelLinks.piano = createSVGPiano(svg, panelRect, 45, pianoHei - 10);

    // MODE CHORDS
    svg.append("text")
        .attr("x", panelRect.x0 + 10)
        .attr("y", panelRect.y0 + pianoHei + 65)
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#fff")
        .text("CHORDS:");
    panelLinks.chords = svg.append("text")
        .attr("x", panelRect.x0 + 10)
        .attr("y", panelRect.y0 + pianoHei + 85)
        .attr("dy", 0)
        .attr("transform", "translate(" + (panelRect.x0 + 15).toString() + ",0)")
        .attr("text-anchor", "start")
        .attr("xml:space", "preserve")
        .style("font-size", "14px")
        .style("fill", "#fff");

    // Default info
    panel.title = "(MODE NAME)";
    panel.chords = "(CHORDS)";

    // Display
    updateD3Panel();

}

// SOURCE: https://bl.ocks.org/mbostock/7555321
// Released under the GNU General Public License, version 3.
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.35, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        words.shift();

        while (word = words.pop()) {
            if (word != 'NL,' && word != 'NL' || 1 == 1) {
                line.push(word);
                tspan.text(line.join("   "));
            }

            if (tspan.node().getComputedTextLength() > width || word == 'NL,' || word == 'NL') {
                line.pop();
                tspan.text(line.join("   "));
                if (word != 'NL,' && word != 'NL') {
                    line = [word];
                } else {
                    line = [];
                }
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }

    });
}
