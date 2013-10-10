(function($){
	if (typeof $ == 'function') {

		// Track other parts of the nav with these selectors alone or in combination:
		// (some ~intelligent tracking should ensue)
		// INACTIVE:
		// All active!
		// ACTIVE:
		// #utility-wrapper
		// #main-nav-wrapper-v2
		// #masthead-v4
		// #main-sub-nav-wrapper
		// #single-carousel
		// #nav-carousel
		// #hot-topics-wrapper

		// This example would track just the utility wrapper and main nav bar and fly-outs
		// $('#utility-wrapper, #main-nav-wrapper-v2').click( function(event){
		// Use the line below if a class is selected on w/in #header-v3
		// $('#header-v3').find('.some-class, #some-id').click( function(event){
		$('#header-v3').click( function(event){
			var a,$target=$(event.target),debug=false;
			if ( $target.is('a') ) {
				a = event.target;
			} else {
				/* Cannot always use .closest() b/c Jobs uses jQuery 1.2 */
				if ( $().closest ) {
					a = $target.closest('a').get(0);
				} else {
					a = $target.parents('a').get(0);
				}
			}
			if( !!a ) {
				if(debug){event.preventDefault();}
				if (!!window.TWP && !!TWP.Util && !!TWP.Util.TrackClick) {
					TWP.Util.TrackClick(a,event,{"debug":debug});
				}
				if(debug){return false;}
			}
			return true;
		});
	} // typeof $ == 'function'
})(jQuery);