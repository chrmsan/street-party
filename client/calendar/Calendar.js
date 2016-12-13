Session.setDefault('editing_calevent', null);
Session.setDefault('showEditEvent', false);

Template.calendar.showEditEvent = function(){
	return Session.get('showEditEvent');
}

Template.editEvent.evt = function(){
	var calEvent = CalEvents.findOne({_id:Session.get('editing_calevent')});
	return calEvent;
}

var updateCalendar = function(){
	$('#calendar').fullCalendar( 'refetchEvents' );
}

Template.editEvent.events({
	'click .save':function(evt,tmpl){
		updateCalEvent(Session.get('editing_calevent'),tmpl.find('.title').value);
		Session.set('editing_calevent',null);
		Session.set('showEditEvent',false);
		$('#EditEventModal').modal("hide");
	},
	'click .close':function(evt,tmpl){
		Session.set('editing_calevent',null);
		Session.set('showEditEvent',false);
		$('#EditEventModal').modal("hide");
	}	,
	'click .remove':function(evt,tmpl){
		removeCalEvent(Session.get('editing_calevent'));
		Session.set('editing_calevent',null);
		Session.set('showEditEvent',false);
		$('#EditEventModal').modal("hide");
	}
})

Template.calendar.rendered = function(){
	$('#calendar').fullCalendar({
		header:{
			left: 'prev,next today',
			center: 'title',
			right: 'month,basicWeek,basicDay'
		},

		dayClick:function( date, allDay, jsEvent, view) {
			CalEvents.insert({title:'New Item',start:date,end:date});
			updateCalendar();
		},

		eventClick:function(calEvent,jsEvent,view){
			Session.set('editing_calevent',calEvent.id);
			Session.set('showEditEvent', true);
			$('#EditEventModal').modal("show");
		},
		eventDrop:function(calEvent){
			CalEvents.update(calEvent.id, {$set: {start:calEvent.start,end:calEvent.end}});
			updateCalendar();
		},
		events: function(start, end, callback) {

			var events = [];
			calEvents = CalEvents.find();
			calEvents.forEach(function(evt){
				events.push({	id:evt._id,title:evt.title,start:evt.start,end:evt.end});
			})

			callback(events);
		},
		editable:true
	});

	Tracker.autorun( () => {
		CalEvents.find().fetch();
		$( "#calendar" ).fullCalendar( 'refetchEvents' );
	});
}
var removeCalEvent = function(id,title){
	CalEvents.remove({_id:id});
	updateCalendar();
}
var updateCalEvent = function(id,title){
	CalEvents.update(id, {$set: {title:title}});
	updateCalendar();
}