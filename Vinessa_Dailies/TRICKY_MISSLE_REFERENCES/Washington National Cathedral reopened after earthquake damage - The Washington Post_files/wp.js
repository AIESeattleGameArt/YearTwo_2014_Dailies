/*global wpAd, commercialNode:true, wpAds:true, wp_meta_data, placeAd2, unescape, escape, $, crtg_content, wpTiles:true, countyName:true, stateName:true  */
(function (win, doc, wpAd, undefined) {

  'use strict';

  var $ = win.jQuery || win.$ || undefined;

  wpAd.config = wpAd.config || {};

  //wp specific flags
  wpAd.flags.testEnv = !!wpAd.tools.urlCheck(/http:\/\/devprev\.|http:\/\/qaprev\.|http:\/\/prodprev\./);
  wpAd.flags.gamesTile = !!wpAd.tools.urlCheck(/gamestile/);
  wpAd.flags.hpRefreshTest = !!/test_hp_refresh/.test(location.search);

  //wpAd.flags.postscribe = /blockingAds/.test(location.search) ? false : true;

  wpAd.constants = {
    'ad_config_url': /ad_config_url\=/.test(location.search) ? decodeURIComponent(location.search.split(/ad_config_url\=/)[1].split(/&/)[0]) : 'http://js.washingtonpost.com/wp-srv/ad/wp_config.js',
    'site': 'wpni',
    'domain': 'washingtonpost.com'
  };

  //called on first placeAd2 call
  wpAd.config.init = function () {
    //nothing at the moment
  };

  //called via wpAd.cache.init:
  wpAd.config.front = function () {
    if(wp_meta_data.contentType) {
      return(typeof wp_meta_data.contentType === 'object' && wp_meta_data.contentType[0] === 'front') || (wp_meta_data.contentType === 'front') ? true : false;
    }
    //non-methode pages:
    return win.commercialPageType && win.commercialPageType === 'front' ? true : false;
  };

  //site specific keyvalues, in addition to generic keyvalues:
  wpAd.config.keyvalues = {
    u: function () {
      return wpAd.cache.hasOwnProperty('u') ? wpAd.cache.u : (function () {
        var s_vi = wpAd.tools.getCookie('s_vi'),
          m = win.wp_meta_data || {},
          rv = '';

        //pass in s_vi cookie value:
        if(s_vi) {
          s_vi = s_vi.split(/\|/)[1];
          if(s_vi) {
            s_vi = s_vi.split(/\[/)[0].split(/-/);
            rv = 'o*' + s_vi[0] + ',' + s_vi[1];

            //get page name, replace spaces with underscores and then limit the string to 100 characters
            rv += (win.TWP && win.TWP.Data && win.TWP.Data.Tracking && win.TWP.Data.Tracking.props && win.TWP.Data.Tracking.props.page_name ? ',' + win.TWP.Data.Tracking.props.page_name.replace(/ /g, '_').slice(0, 100) : '');

            //",,,", then get page type and then need to append ",abc" to the end
            rv += ',,,' + (m.contentType && wpAd.tools.zoneBuilder.contentType[m.contentType.toString()] ? wpAd.tools.zoneBuilder.contentType[m.contentType.toString()] : 'article') + ',abc';
          }
        }

        //store the string for reuse:
        wpAd.cache.u = rv;

        return wpAd.cache.u;
      })();
    },
    de: function(){
      return wpAd.cache.hasOwnProperty('de') ? wpAd.cache.de : (function () {
        var cookie = unescape(wpAd.tools.getCookie('de'));
        wpAd.cache.de = cookie ? cookie.split(':') : [];
        return wpAd.cache.de;
      })();
    },
    articleId: function () {
      return wpAd.cache.hasOwnProperty('articleId') ? wpAd.cache.articleId : (function () {
        wpAd.cache.articleId = [];
        if(typeof wp_meta_data !== 'undefined' && wp_meta_data.contentType && wp_meta_data.contentType[0] === "CompoundStory") {
          var a = doc.location.href.split("/");
          wpAd.cache.articleId = [a[a.length - 1].toLowerCase().split("_story")[0]];
        }
        return wpAd.cache.articleId;
      })();
    },
    author: function () {
      return wpAd.cache.hasOwnProperty('author') ? wpAd.cache.author : (function() {
        wpAd.cache.author = [];
        if (typeof wp_meta_data !== 'undefined' && wp_meta_data.author) {
          for (var i=0; i < wp_meta_data.author.length; i++) {
            wpAd.cache.author[i]=wp_meta_data.author[i].replace(/[^\w\s]/gi, '').replace(/\s/g,"_").toLowerCase();
          }
        }
        if (typeof wp_meta_data !== 'undefined' && wp_meta_data.blogger) {
          for (var j=0; j < wp_meta_data.blogger.length; j++) {
            wpAd.cache.author.push(wp_meta_data.blogger[j].replace(/[^\w\s]/gi, '').replace(/\s/g,"_").toLowerCase());
          }
        }
        return wpAd.cache.author;
      })();
    },
    page: function () {
      return wpAd.cache.hasOwnProperty('page') ? wpAd.cache.page : (function () {
        if(typeof wp_meta_data !== 'undefined' && wp_meta_data.contentType && wpAd.tools.zoneBuilder.contentType[wp_meta_data.contentType[0].toLowerCase()]) {
          wpAd.cache.page = [wpAd.tools.zoneBuilder.contentType[wp_meta_data.contentType[0].toLowerCase()]];
          return wpAd.cache.page;
        }
        //default to article
        wpAd.cache.page = ['article'];
        return wpAd.cache.page;
      })();
    },
    wpatc: {
      exec: function () {
        if(!wpAd.cache.hasOwnProperty('wpatc')) {

          var cookie = wpAd.cache.cookies.hasOwnProperty('WPATC') ? wpAd.cache.cookies.WPATC : (function () {
            wpAd.cache.cookies.WPATC = wpAd.tools.getCookie('WPATC');
            return wpAd.cache.cookies.WPATC;
          })(),
            l, a;

          wpAd.cache.cookies.WPATC = cookie ? unescape(cookie) : null;
          wpAd.cache.wpatc = {};

          if(cookie) {
            cookie = unescape(cookie).split(':');
            l = cookie.length;
            while(l--) {
              a = cookie[l].split('=');
              if(wpAd.cache.wpatc[a[0]]) {
                wpAd.cache.wpatc[a[0]].push(a[1]);
              } else {
                wpAd.cache.wpatc[a[0]] = [a[1]];
              }
            }
          }
        }
        //loop through previously cached object with wpatc values in saved to it
        for(var key in wpAd.cache.wpatc) {
          wpAd.briefcase.keyvalues[key] = wpAd.cache.wpatc[key];
        }
      }
    },
    areaId: function () {
      return wpAd.cache.hasOwnProperty('areaId') ? wpAd.cache.areaId : (function () {
        wpAd.cache.areaId = [];
        var a = wpAd.tools.urlCheck('areaId', {
          type: 'variable'
        });
        if(win.hs && win.hs.geo_area_id) {
          wpAd.cache.areaId = win.hs.geo_area_id.split(';');
        }
        if(a) {
          wpAd.cache.areaId.push(a);
        }
        return wpAd.cache.areaId;
      })();
    },
    aptco: function () {
      return wpAd.cache.hasOwnProperty('aptco') ? wpAd.cache.aptco : (function () {
        var a = wpAd.tools.urlCheck('aptco', {
          type: 'variable'
        });
        wpAd.cache.aptco = a ? [a] : [];
        return wpAd.cache.aptco;
      })();
    },
    co_spon: function(){
      return wpAd.cache.countyName || [];
    },
    metro: function () {
      return wpAd.cache.hasOwnProperty('metro') ? wpAd.cache.metro : (function () {
        var a = wpAd.tools.urlCheck('metro', {
          type: 'variable'
        });
        wpAd.cache.metro = a ? [a] : [];
        return wpAd.cache.metro;
      })();
    },
    locExpSponsor: function () {
      return wpAd.cache.hasOwnProperty('locExpSponsor') ? wpAd.cache.locExpSponsor : (function () {
        wpAd.cache.locExpSponsor = [];
        if(win.countyName && win.stateName) {
          var invalidKW = ['?', '=', '/', '\\', ':', ';', ',', '*', '(', ')', '&', '$', '%', '@', '!', '^', '+', ' ', '[', ']', '{', '}', '.'],
            l = invalidKW.length,
            csRE;

          while(l--) {
            csRE = new RegExp('(\\' + invalidKW[l] + ')', 'g');
            countyName = countyName.replace(csRE, "").toLowerCase();
            stateName = stateName.replace(csRE, "").toLowerCase();
          }

          wpAd.cache.locExpSponsor = [win.countyName + "-" + win.stateName];
        }
        return wpAd.cache.locExpSponsor;
      })();
    },
    ppwidget: function(){
      return wpAd.cache.hasOwnProperty('ppwidget') ? wpAd.cache.ppwidget : (function(){
        wpAd.cache.ppwidget = wpAd.tools.urlCheck('tid', {type:'variable'}) === 'pp_stream' ? '1' : '';
        return wpAd.cache.ppwidget;
      })();
    },
    wpnode: function(){
      return [commercialNode];
    }
  };

  //media page check:
  wpAd.tools.mediaPage = function () {
    //cache as many of these as possible to reduce duplicate checks:
    return wpAd.cache.hasOwnProperty('mediaPage') ? wpAd.cache.mediaPage : (function () {
      //default to false:
      wpAd.cache.mediaPage = false;

      //17457-CD
      if((win.thisNode && /media|photo|video/.test(win.thisNode)) || (commercialNode && /media|photo|video/.test(commercialNode)) || wpAd.tools.urlCheck(/video|gallery|scene-in|mobile|\/wp-srv\//)) {
        wpAd.cache.mediaPage = true;
      }
      //N/A
      else if(win.wp_meta_data && wp_meta_data.contentType && /GraphicStory|MediaGallery|PanoStory|VideoStory/.test(wp_meta_data.contentType.toString())) {
        wpAd.cache.mediaPage = true;
      }
      //10522-RZ,12622-ML
      else if(/\/email|admin|\/puzzles|reachwall/.test(commercialNode) || wpAd.tools.urlCheck('_print.html')) {
        wpAd.cache.mediaPage = true;
      }
      return wpAd.cache.mediaPage;
    })();
  };

  //QUIGO TEXTLINKS
  wpAd.textlinks = {
    //configuration file url:
    config_url: 'http://www.washingtonpost.com/wp-srv/ad/textlink_quigo_data.json',
    //if the textlinks config script is not yet loaded, ajax it in
    //once wpAd.textlinks.templates is available, so some initialisation
    init: function(contentType, position, cnode) {

      //Safety check to prevent cross-domain ajax errors:
      if(!/www\.washingtonpost\.com/.test(window.location.host)){
        return false;
      }

      if(!wpAd.textlinks.templates){
        wpAd.tools.ajax({
          url: wpAd.textlinks.config_url,
          dataType: 'json',
          timeout: 2000,
          crossDomain: true,
          cache: true,
          success: function(data){
            wpAd.textlinks.templates = data.templates;
            wpAd.textlinks.category = data.category;
            wpAd.textlinks.init(contentType, position, cnode);
          },
          error: function(){
            if(win.console && typeof win.console.log === 'function'){
              win.console.log('Quigo textlinks config AJAX error:');
              win.console.log(arguments);
            }
          }
        });
        return false;
      }

      contentType = wpAd.textlinks.templates[contentType] ? contentType : 'CompoundStory';
      cnode = wpAd.textlinks.cat_check(cnode);

      var cmpid = win.cmpid && win.cmpid.toLowerCase() || false,
          template = cmpid && wpAd.textlinks.templates[contentType][position][cmpid] || wpAd.textlinks.templates[contentType][position].standard;
      cnode = template[cnode] ? cnode : 'ros';

      if(wpAd.tools.urlCheck('debugAdCode') && win.console && typeof win.console.log === 'function') {
        win.console.log('template=', contentType);
        win.console.log('pos=', position);
        win.console.log('channel=', cnode);
        if(cmpid){
          win.console.log('Test Recipe:', 'cmpid=' + win.cmpid, template);
        } else{
          win.console.log('Standard Placement:', template);
        }
      }

      return wpAd.textlinks.build(template[cnode], position);
    },
    cat_check: function(cNode) {
      if(wpAd.textlinks.category[0][cNode]) {
        return cNode;
      }

      var categories = wpAd.textlinks.category,
        l = cNode.match(/\//) ? categories.length : 1,
        category, i;

      while(l--) {
        for(category in categories[l]) {
          i = categories[l][category].length;
          while(i--) {
            if(cNode.match(new RegExp('^' + categories[l][category][i] + '(\/|$)'))) {
              return category;
            }
          }
        }
      }
      return 'ros';
    },
    article_check: function() {
      return !wpAd.tools.urlCheck('_Comments.html') && (wpAd.tools.urlCheck('/wp-dyn/content/article/') || wpAd.tools.urlCheck('/wp-dyn/content/discussion/')) ? true : false;
    },
    index_check: function() {
      var k = ['politics', 'opinion', 'business', 'technology'],
        j = k.length,
        i;
      for(i = 0; i < j; i++) {
        if(commercialNode.match(k[i])) {
          return(commercialNode.match(k[i] + '/')) ? false : 'index';
        }
      }
      return 'index2';
    },
    blog_check: function() {
      return(wpAd.tools.urlCheck(/\/\d{4}\/\d{2}\/.*\.htm/gi)) ? 'blog_permalink' : 'blog_main';
    },
    //return the parsed document title
    getTitle: function() {
      var h = doc.title;
      if(h && h !== "undefined") {
        if(h.length > 100) {
          h = h.substring(0, 50) + "-" + h.substring(h.length - 50, h.length);
        }
      }
      return escape(h);
    },
    //return the meta keywords as an URL safe encoded String (limited to 100 chars)
    getMetaVals: function() {
      return encodeURIComponent((win.wp_meta_data.keywords || []).join(',')).replace(/\%2C/g, ',').slice(0, 100);
    },
    //get the target container to append the textlinks to
    getSlug: function(pos){
      return doc.getElementById('wpni_adi_' + pos) || doc.getElementById('slug_' + pos);
    },
    //build the quigo iframe URL, generate the iframe and pass it to wpAd.textlinks.render to render it
    build: function(template, position) {
      var url = win.location,
        adsonar_placementId = template[0],
        adsonar_pid = template[1],
        adsonar_ps = /^local/.test(commercialNode) ? '0' : '-1',
        adsonar_zw = template[2],
        adsonar_zh = template[3],
        rand = wpAd.cache.ord || Math.floor(Math.random() * 1E6),
        srcUrl = "http://ads.adsonar.com/adserving/getAds.jsp?previousPlacementIds=&placementId=" + adsonar_placementId + "&pid=" + adsonar_pid + "&ps=" + adsonar_ps + "&zw=" + adsonar_zw + "&zh=" + adsonar_zh + "&url=" + escape(url) + "&v=5&dct=" + wpAd.textlinks.getTitle() + "&metakw=" + wpAd.textlinks.getMetaVals();

      wpAd.textlinks.render(wpAd.tools.iframeBuilder({
        'src': srcUrl,
        'id': "adsonar_serve" + rand,
        'name': "adsonar_serve" + rand,
        'width': adsonar_zw,
        'height': adsonar_zh,
        'vspace': '0',
        'hspace': '0'
      }), 'sponsor_links_' + position);
      return true;
    },
    //render the iframe by appending it to the slug container div
    render: function(element, pos){
      var slug = wpAd.textlinks.getSlug(pos);
      if(slug){
        slug.appendChild(element);
      }
    }
  };

  wpAd.tools.add_criteo = function(){
    var cookieName = 'cto_was',
      script_base = 'http://rtax.criteo.com/delivery/rta/rta.js';

    wpAd.cache.cookies = wpAd.cache.cookies || {};

    if(!wpAd.cache.cookies.hasOwnProperty('criteo')){
      wpAd.cache.cookies.criteo = wpAd.tools.getCookie(cookieName);
    }

    win.crtg_content = wpAd.cache.cookies.criteo;

    wpAd.tools.ajax({
      cache: true,
      dataType: 'script',
      url: script_base,
      timeout: 2000,
      crossDomain: true,
      data: {
        netId: '1180',
        cookieName: cookieName,
        rnd: Math.floor(Math.random() * 1E11),
        varName: 'crtg_content'
      },
      error: function(err){
        if(wpAd.flags.debug){
          try{win.console.log('CRITEO timeout error:', err);}catch(e){}
        }
      },
      success: function(data){
        if(wpAd.flags.debug){
          try{win.console.log(script_base, 'loaded:');}catch(e){}
        }
      }
    });
  };

  if(!wpAd.flags.hpRefreshTest && wpAd.flags.is_homepage){
    //homepage refresh modification:
    win.TWP = win.TWP || {};
    win.TWP.hpRefreshTests = win.TWP.hpRefreshTests || {};
    win.TWP.hpRefreshTests.adRefreshFunction = function() {
      return wpAd.flags.test_ads ? false : true;
    };
  }

  //last chance to overwrite/add/modify keyvalues for specific or non-standard purposes:
  wpAd.config.hackBin = function () {

    //important that we clone this
    var tempcase = wpAd.tools.clone(wpAd.briefcase);

    //homepage hacks:
    if(wpAd.flags.is_homepage) {
      //20757-CD
      if(tempcase.what === 'leaderboard'){
        tempcase.where += '/lb';
      }
      if((tempcase.what === 'leaderboard' || tempcase.what === 'flex_bb_hp') && wpAd.flags.hpRefresh){
        tempcase.where += 'refresh';
      }

      //20007-CD
      if(tempcase.what === 'pushdown'){
        var adi_push = doc.getElementById('wpni_adi_pushdown');
        if(adi_push){
          adi_push.style.backgroundImage = 'url(http://img.wpdigital.net/wp-adv/test/mstest/pushdown-ad-small.png)';
          adi_push.style.backgroundPosition = '-7px -100px';
        }
      }
    }

    if(tempcase.what === 'featrent' && $){
      $('#wpni_adi_featrent').css({
        background: 'none',
        padding: '0'
      });
    }

    if(tempcase.what === 'navtile'){
      tempcase.where = 'wpnavtile';
    }

    //
    if(/^tiffany_tile/i.test(tempcase.what)){
      if(wpAd.flags.is_homepage){
        tempcase.keyvalues.sz = ['184x90'];
      }
      //important to disable carousel
      wpTiles.hasTiff = true;
    }

    //20074-CD
    if(tempcase.what === 'flex_ss_bb_hp' && (tempcase.where === 'lifestyle/home' || tempcase.where === 'lifestyle/home/front' || tempcase.where === 'lifestyle/home-garden')){
      tempcase.where += '/flex';
    }

    //Viewable Impression exclusions:
    if(tempcase.delivery === 'vi'){
      tempcase.keyvalues['!c'].push('media', 'intrusive');
    }

    //21684-leaderboard_2 exclusions
    if (tempcase.what === "leaderboard_2") {
      tempcase.keyvalues['!c'].push('intrusive');
    }

    //19882-criteo implementation
    if(win.crtg_content){
      tempcase.keyvalues.onTheFly += crtg_content;
    }

    if(tempcase.defaults.what === 'sponsor|rental') {
      tempcase.keyvalues.onTheFly += 'tn=12;tr=1;tcp=0;to=v;ta=left;tva=top;';
    }

    //18344
    if(tempcase.where === 'rentals' && win.wpAds && wpAds.metro && wpAds.metro.exec) {
      tempcase.keyvalues.onTheFly += wpAds.metro.exec();
    }

    if(tempcase.where.match(/realestate|trulia/)) {
      tempcase.keyvalues.onTheFly += (function () {
        if(win._AD_TARGETING && win._AD_TARGETING.county && win._AD_TARGETING.state) {
          var co_spon = win._AD_TARGETING.county + '-' + win._AD_TARGETING.state;
          return 'co_spon=' + co_spon.toLowerCase().replace(/ /gi, '_').replace(/&[a-z]*(?=;)/gi, '').replace(/[^a-z\d\-\_]/gi, '') + ';';
        }
        return '';
      })();
    }

    if(tempcase.where.match(/^wiki|innovation/) && tempcase.what.match('leaderboard')) {
      tempcase.keyvalues.onTheFly += '!category=bigleaderboard;';
    }

    //11958-MB, 13745-JM
    if(tempcase.where === 'trulia') {
      if(tempcase.what === 'leaderboard') {
        tempcase.keyvalues['!c'].push('media');
      } else if(tempcase.what === 'flex_bb_tp') {
        tempcase.keyvalues['!c'].push('intrusive');
      }
    }

    //18593-personalpost
    //19648-AL
    if(commercialNode.match(/washingtonpost\.com|personalpost|obituaries|weather|jobs\/search/)) {
      tempcase.keyvalues['!c'].push('intrusive');
    }

    if(wpAd.tools.mediaPage()) {
      tempcase.keyvalues['!c'].push('media');
    }

    //21511-CD
    //via email 20130604 - CD, Levi
    if(tempcase.what === 'inline_bb' || tempcase.what === 'navtile'){
      tempcase.keyvalues.ord = [Math.floor(Math.random() * 1E18)];
    }

    //Add jQuery depended hackbin checks here:
    if($){
      //STUPID eyeblaster pushdown fix to prevent their pushdown forcing itself over the nav
      if(tempcase.what === 'pushdown' && wpAd.flags.is_homepage){
        $(window).load(function(){
          var $targets = $('#eyeDiv');
          if($targets.length){
            $('#main-nav>li').not('.jobs, .posttv').hover(function(){
              $('div[id^="eb"]', $targets).find('object, embed').each(function(){
                $(this).parent().addClass('adnoDisplay');
              });
            }, function(){
              $('div[id^="eb"]', $targets).find('object, embed').each(function(){
                $(this).parent().removeClass('adnoDisplay');
              });
            });
          }
        });
      }

      if(tempcase.what === 'persistent_bb' && $('#wpni_adi_persistent_bb').length){
        var $bb = $('#wpni_adi_persistent_bb');
        var tile = new Image();
        tile.src = "//img.wpdigital.net/wp-srv/ad/img/games_300x250.jpg";
        tile.height = "250";
        tile.width = "300";
        tile.alt = "WP Games - Click Here for More!";
        var $a = $('<a></a>');
        $a.attr({
          href: "//games.washingtonpost.com?wpmk=MK0000246",
          target: "_blank"
        }).css({
          'display':'block',
          'margin-top':'5px'
        });
        $a.html(tile);
        var appendTimer = setTimeout(function () {
          $bb.append($a);
        }, 500);
      }
    }

    return tempcase;
  };



  win.wpTiles = win.wpTiles || {};
  wpTiles.nnHasAd = function () {
    if(win.NetworkNews && win.NetworkNews.Constants) {
      win.NetworkNews.Constants.hasAd = true;
    }
  };
  wpTiles.init = function (a) {
    placeAd2(commercialNode, a, false, '');
  };

  //20127-CD
  if(commercialNode.match("lifestyle/kidspost")){
    commercialNode = commercialNode.replace(/^lifestyle\/kidspost/i,"kidspost");
  }

  //21321-CD
  if(commercialNode === 'cityguide/search' && (/Kid-Friendly/i.test(unescape(location.href)) || (/Kid Friendly/i.test(unescape(location.href))))){
    commercialNode = 'cityguide/kidfriendly';
  }

  //21406-CD
  if(commercialNode === 'cityguide/search' && /holiday/i.test(unescape(location.href))){
    commercialNode = 'cityguide/holiday';
  }

  //19879-CD
  //22020-CD
  //arkadium games section commercialNode hack:
  if(/games\.washingtonpost/i.test(doc.domain) && /entertainment\/arkadium/.test(commercialNode) && !wpAd.arkadiumNodeHack){
    commercialNode += '/' + (function () {
      var path = location.pathname.replace(/^\//, '').replace(/\/$/,'');
      if (path === "") {
        return "front";
      } else {
        path = /\//.test(path) ? path.split(/\//) : [path];
        return path.reverse().join('/');
      }
    })();
  }

  //gog temp /front hack
  if(commercialNode === 'cityguide' && /^\/gog\/(index\.html)?/.test(location.pathname)){
    commercialNode += '/front';
  }

  function wpplus(){
    $.ajax({
      cache: true,
      dataType: 'script',
      crossDomain: true,
      url: 'http://js.washingtonpost.com/wp-srv/ad/wpPlusPixels.js',
      timeout: 2000,
      error: function(err){
        if(wpAd.flags.debug){
          try{win.console.log('wpPlusPixels.js timeout error:', err);}catch(e){}
        }
      },
      success: function(data){
        if(wpAd.flags.debug){
          try{win.console.log('wpPlusPixels.js', 'loaded');}catch(e){}
        }
      }
    });
  }


  if(!wpAd.flags.no_ads) {
    //ADD THE TEMPLATES - generated via flight manager tool:
    wpAd.tools.writeScript(wpAd.constants.ad_config_url);

    //add the tiffany tiles
    wpAd.tools.writeScript('http://js.washingtonpost.com/wp-srv/ad/tiffanyTiles.js');

    //19882 - Criteo Implementation
    if(!/msie 6|msie 7|msie 8/i.test(navigator.userAgent)){
      wpAd.tools.add_criteo();
    }

    if(wpAd.flags.postscribe && wpAd.postscribe){
      wpAd.postscribe.init();
    }

    //KRUX integration - excluding kidspost
    if(wpAd.flags.krux_enabled && !/kidspost/i.test(commercialNode) && wpAd.tools.addKruxScript){
      wpAd.tools.addKruxScript('IbWIJ0xh');
    }
  }

  function execSubscribePromo(){
    var today = win.estNowWithYear.substr(0,8);
    //22190
    if (today > "20131009" && !wpAd.templates.pushdown && !wpAd.templates.leaderboard && !wpAd.flags.disableSubscribePromo) {
      wpAd.tools.generateTemplate();
      placeAd2(commercialNode, "pushdown", false, "");
    }
  }

  //21774-JH
  if(/brand-?connect/i.test(window.commercialNode)){
    wpAd.flags.no_interstitials = true;
  }

  //#21628-CD,JB
  //exclude interstitials from these pages:
  if(win.wp_meta_data && win.wp_meta_data.page_id){
    var ids = [
        '1000.2.3828040051',
        '1000.2.3828515386',
        '1000.3.1778964340',
        '1000.2.3828630441'
      ],
      l = ids.length,
      id = win.wp_meta_data.page_id.toString();

    while(l--){
      if(ids[l] === id){
        wpAd.flags.no_interstitials = true;
        break;
      }
    }
  }


  //pass latlong to ad call on gabriels pages
  if(window.latlong && /washingtonpost-cms-staging\.gabriels/.test(location.href) && /^realestate\/listings/i.test(commercialNode)){
    var apiBase = 'http://www.washingtonpost.com/real-estate/neighborhoods/getCountyName.json?',
      cb = 'wpAd.countyNameCB';

    wpAd.countyNameCB = function(data){
      if(data.name && typeof data.name === 'string'){
        wpAd.cache.countyName = data.name.replace(/\s+/g, '_').toLowerCase();
      }
    };

    wpAd.tools.writeScript(apiBase + [
      'latlon=' + window.latlong.latitude + '/' + window.latlong.longitude,
      'jsonp=' + cb
    ].join('&'));
  }



  // had to remove "jobs" from window.load queue, presumably because jquery on jobs was being
  // overwritten after this point, but before window.load
  if(/^jobs/.test(commercialNode)){
    wpplus();
  }

  if($ && !wpAd.flags.no_ads){

    if(wpAd.flags.is_homepage){
      $(doc).on('onTwpMeterReady', execSubscribePromo);
    }

    $(function(){
      //22135 - JH temporary fix for topicly tile click tracker
      $('#carousel-full div.container:last div.left a[href*="topicly"]').attr({
        href: 'http://t.mookie1.com/t/v1/clk?migAgencyId=549&migSource=adsrv2&migTrackDataExt=3811217;103077962;276353948;0&migRandom=[timestamp]&migTrackFmtExt=client;io;ad;crtv&migUnencodedDest=http://ad.doubleclick.net/clk;276353948;103077962;r'
      });
    });

    //Deferred:
    $(window).load(function(){

      //20999 - JH - brand connect tracking:
      var bcdiv = $('div.brand-connect-module');
      if(bcdiv.length){
        $.ajax({
          cache: true,
          dataType: 'script',
          crossDomain: true,
          url: 'http://js.washingtonpost.com/wp-srv/ad/min/brandConnectTracking.js',
          timeout: 2000,
          error: function(err){
            if(wpAd.flags.debug){
              try{win.console.log('brandConnectTracking.js timeout error:', err);}catch(e){}
            }
          },
          success: function(data){
            wpAd.brandConnect.init();
            if(wpAd.flags.debug){
              try{win.console.log('brandConnectTracking.js', 'loaded');}catch(e){}
            }
          }
        });
      }

      //test hp refresh script:
      if(wpAd.flags.hpRefreshTest && wpAd.flags.is_homepage){
        $.ajax({
          url: 'http://www.washingtonpost.com/wp-srv/ad/min/hpRefreshConfig.js',
          timeout: 2000,
          crossDomain: true,
          cache: true,
          success: function(){
            //success
          },
          error: function(){
            if(win.console && typeof win.console.log === 'function'){
              win.console.log('hp refresh config AJAX error:');
              win.console.log(arguments);
            }
          }
        });
      }

      //subscription promo on homepage:
      if(wpAd.flags.is_homepage){
        execSubscribePromo();
      }

      // add wp+ pixels
      // already added for jobs - see above
      if(/!^jobs/.test(commercialNode)){
        wpplus();
      }

      // Fix for "code in iframe" issue.
      // Chrome is browser, jQuery exists (and test flag, for now):
      // running test from 7/25 - 7/28
      if(win.chrome && $ && (win.estNowWithYear >= '201307250000' && win.estNowWithYear <= '201307282359' || wpAd.flags.reloadIframes)){
        // wait to check for previouslyViewed
        if(win.previouslyViewed && wpAd.tools.iframeAdReloader){
          // reload iframe ads
          wpAd.tools.iframeAdReloader();
        }
      }

    });
  }

})(window, document, wpAd);