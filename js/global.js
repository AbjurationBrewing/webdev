$(document).ready(function () {
    if ($.cookie("ageOk") !== 't') {
        $('.ageConfirmDiv').fancybox({
            'modal': true,
            'closeOnEscape': false,
            'autoScale': true,
            'transitionIn': 'elastic',
            'transitionOut': 'elastic',
            'centerOnScroll': true
        }).click();

        $('#ageNo').on('click', function (event) {
            event.stopPropagation();
            $.removeCookie("ageOk");
            window.location.replace('http://www.google.com');
        });

        $('#ageYes').on('click', function (event) {
            event.stopPropagation();
            $.cookie("ageOk", "t", { expires: 1 });
            $.fancybox.close();
        });
    }

    var untappdUrl = 'https://api.untappd.com/v4/brewery/checkins/127740?client_id=107954B2DB6BD6284C8956D490E2D532FE696892&client_secret=BE2658437388DCA8572506973F909AD3606AE8FD';
    $.get(untappdUrl, function (data) {
        if (!$.isEmptyObject(data) && !$.isEmptyObject(data.response) && !$.isEmptyObject(data.response.checkins) && !$.isEmptyObject(data.response.checkins.items)) {
            var items = data.response.checkins.items;
            
            $.each(items, function (i, value) {
                var userLink = 'https://untappd.com/user/' + value.user.user_name;
                var beerLink = 'https://untappd.com/b/' + value.brewery.brewery_slug + '-' + replaceAll(replaceAll(replaceAll(replaceAll(value.beer.beer_name, ' ', '-'), '.', '-'), '(', ''), ')', '') + '/' + value.beer.bid;
                var breweryLink = 'https://untappd.com/w/' + value.brewery.brewery_slug + '/' + value.brewery.brewery_id;
                var html = '';

                if (i != 0) {
                    html += '<hr />';
                }
                else {
                    $('.untappdHeader').html('<a href="' + breweryLink + '" target="_blank"><img class="breweryImage" src="' + value.brewery.brewery_label + '"></a>' +
                        '<strong>' + value.brewery.brewery_name + '</strong>');
                }

                html += '<div class="untappdAvatarWrapper"><img class="untappdAvatar" src="' + value.user.user_avatar + '"></div>';

                html += '<div class="untappdText">';
                html += '<a href="' + userLink + '" target="_blank">' +
                    value.user.first_name + ' ' + value.user.last_name + '</a> ' +
                    'is drinking a ' +
                    '<a href="' + beerLink + '" target="_blank">' + value.beer.beer_name + '</a> ' +
                    'by ' +
                    '<a href="' + breweryLink + '" target="_blank">' + value.brewery.brewery_name + '</a>';

                if (!$.isEmptyObject(value.venue) && value.venue.venue_name != undefined && !$.isEmptyObject(value.venue.venue_name)) {
                    html += ' at <a href="https://untappd.com/venue/' + value.venue.venue_id + '" target="_blank">' + value.venue.venue_name + '</a>';
                }

                html += '<br /><div class="untappdDate">' + formatDate(new Date(value.created_at)) + '</div>';
                html += '</div>';

                html = '<div>' + html + '</div>';

                $('.untappdDiv').append(html);
            });
        }
        else {
            // error
        }
    }, 'json').fail(function () {
        // error
    });

    var feed = new Instafeed({
        //resolution: 'low_resolution',
        //sortBy: 'random',
        get: 'user',
        userId: 1498935118,
        accessToken: '1498935118.467ede5.d6db291117c6405a9061608a0232cc32'
    });
    feed.run();

    $('.openRecipeLink').click(function () {
        openRecipe($(this).closest('li').find('h1').attr('id'));
        return false;
    });

    var beer = $.trim(getQueryStringValue('beer'));

    if (beer != '') {
        $('#ourBeersNav').click();
        var list = $('#featuresSlider', '.beer-list').find('li.dot');
        
        if (list.length >= beer){
            list.get(beer - 1).click();
        }
    }
});

function openRecipe(name) {
    var div = $('div', '.recipes').filter(function () {
        return this.id.toLowerCase() == 'pop_' + name.toLowerCase();
    });

    div.fancybox({
        'modal': false,
        'closeOnEscape': true,
        'autoScale': true,
        'transitionIn': 'elastic',
        'transitionOut': 'elastic',
        'centerOnScroll': true
    }).click();
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function getQueryStringValue(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}