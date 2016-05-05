(function(){
    var weeksInYear = 52,
        weeksInYearExact = 52.177457,
        cellOffset = 11,
        dateFormat = "MM, d yy",
        oneDay = 24*60*60*1000,
        dateOfBirth,
        retireAt,
        currentAgeInWeeks;

    var currentAgeInWeeks = 1560;

    d3.select("#vizualizeLifeChartBtn")
        .on("click", vizualizeLifeChart);

    d3.select("button.close").on("click", closeErrorMsg);

    function vizualizeLifeChart(){
        if(validate()){
             var svg = d3.select("svg");
            $("#lifeChartContainer").show();
            dateOfBirth = Date.parse($("#dateOfBirth").val());

            currentAgeInWeeks = weeksUntilToday(dateOfBirth);

            retireAt = parseInt($("#retirementAge").val());
            d3.select("svg")
                .transition()
                .duration(2000)
                .attr("height", function(){return (retireAt * weeksInYearExact / weeksInYear) * cellOffset + cellOffset + "px"})


            var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<strong>Week:</strong> <span style='color:red'>" + (d.index + 1) + ":&nbsp;</span></strong>" +
                getWeekDateRangeString(d);
              });

            svg.call(tip);

            svg.selectAll("rect").remove();

            svg.selectAll("rect")
            .data(getWeeks())
            .enter()
            .append("rect")
            .attr('class', 'week')
            .style("opacity", .6)
            .attr("fill", "gray")
            .attr("height", cellOffset - 1)
            .attr("width", cellOffset - 1)
            .attr("x", function(d,i){
                var x = i % 52;
                return x * cellOffset;
            })
            .attr("y", function(d,i){
                return Math.floor(i / weeksInYear) * cellOffset;
            })
            .on("mouseover", function(d,i){
                tip.show(d,i);
                d3.select(this).style({opacity:'0.9'});
            })
            .on("mouseout", function(d){
                tip.hide();
                d3.select(this).style({opacity:'0.6'});
            })
            .on("click", showCellFragment);

            d3.select("svg").selectAll("rect")
            .transition()
            .delay(function(d,i){return i * 3})
            .duration(500)
            .attr("fill", function(d,i){
                return (i < currentAgeInWeeks) ? 'red' : (i == currentAgeInWeeks) ? 'green' : 'gray';
            });

            $("#legend").show();
            showSnackBar("This is your life and it's ending one minute at a time.");
        }
    }

    function showCellFragment(d,i){
        console.log('showing cell fragment..');
        console.log(d);
        $("#lifeChartContainer").attr("class", "col-md-7");

        $("#selectedWeekHeader").html(i + 1 + ": " + getWeekDateRangeString(d));


        $("#weekCellContainer").show();

        d3.selectAll("rect.selectedWeek")
            .classed("selectedWeek", false)
            .attr("stroke-width", 0);

        d3.select(this)
            .classed("selectedWeek", true)
            .attr("stroke", "yellow")
            .attr("stroke-width", 5);
    }

    function getWeeks(){
        var weeks = [];

        for(var i = 0; i < Math.round(weeksInYearExact * retireAt); i++){
            var weekStartDate = new Date(dateOfBirth + (oneDay) * 7 * i);
            var weekEndDate = new Date(dateOfBirth + (oneDay) * 7 * (i + 1));

            weeks.push({
                index : i,
                weekStartDate : weekStartDate,
                weekEndDate : weekEndDate,
            });
        }

        return weeks;
    }

    function weeksUntilToday(aDate) {
        return Math.round(((new Date()-aDate)/(oneDay)) / 7);
    }

    function validate(){
        var result = true,
            retirementAgeInput = parseInt($("#retirementAge").val()),
            dateOfBirthInput = $("#dateOfBirth").val();

        if(!dateOfBirthInput || !retirementAgeInput){
            var errorTxt = "Please, provide correct date of birth and planned retirement age. It's easy, you can do it!";
            $("#errorMsgTxt").html(errorTxt);
            result = false;
        }


        if(retirementAgeInput > 150){
            var errorTxt = retirementAgeInput + "? You wish :) Please, be more reasonable.";
            $("#errorMsgTxt").html(errorTxt);
            result = false;
        }

        if(result){
            $("#errorMsg").hide();
        } else{
            $("#errorMsg").show();
        }


        return result;
    }

    function closeErrorMsg(){
        $("#errorMsg").hide();
    }

    function showSnackBar(msg){
        var options =  {
            content: msg, // text of the snackbar
            timeout: 5000 // time in milliseconds after the snackbar autohides, 0 is disabled
        }

        $.snackbar(options);
    }

    function getWeekDateRangeString(d){
        return "<span>" + $.datepicker.formatDate(dateFormat,d.weekStartDate) + "  -  " + $.datepicker.formatDate(dateFormat,d.weekEndDate) + "</span>"
    }

    $( document ).ready(function()
    {
        $(function()
        {
            $.material.init();
            $('.datepicker').datepicker({
                autoclose: true,
                format: dateFormat,
                dateFormat : dateFormat,
                maxDate : '+0m +0w',
                startView : 2
            }).val();
        });
    });
})();