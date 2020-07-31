import EventEmitter from 'events';
import queries from './queryModel';
import pg from '../database app/pg';

export class Notification {
	constructor(email, detail){
		this.user = email;
		this.detail = detail;
	}
}

export const notifInterface = (notifObject) => {
	function _add(){
		try {
			const rows = pg.query(queries.createNotification, [this.user, this.detail])
			return rows;
		} catch(e) {
			console.log(e);
		}
		
	}

	function _update(id, ...args){
		try {
			const rows = pg.query(queries.updateNotification, [id, ...args])
		} catch(e) {
			console.log(e);
		}
	}

	function _getAll() {
		try {
			const rows = pg.query(queries.getAll, [this.user]);
			return rows
		} catch(e) {
			console.log(e);
		}
	}

	function _getWhere(status, user) {
		try {
			const rows = pg.query(queries.getWhere, [status, user])
		} catch(e) {
			// statements
			console.log(e);
		}
	}

	const add = _add.bind(notifObject);
	const update = _update.bind(notifObject);
	const getAll = _getAll.bind(notifObject);
	const getWhere = _getWhere.bind(notifObject);

	return {
		add,
		update,
		getAll,
		getWhere,
	}
}