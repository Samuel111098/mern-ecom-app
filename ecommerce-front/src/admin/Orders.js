import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { listOrders, getStatusValues, updateOrderStatus } from './ApiAdmin';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Orders = () => {
	const [ orders, setOrders ] = useState([]);
	const [ statusValues, setStatusValues ] = useState([]);
	const { user, token } = isAuthenticated();

	const loadOrders = () => {
		listOrders(user._id, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setOrders(data);
			}
		});
	};

	const loadStatusValues = () => {
		getStatusValues(user._id, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setStatusValues(data);
			}
		});
	};

	useEffect(() => {
		loadOrders();
		loadStatusValues();
	}, []);

	const showOrdersLength = () => {
		if (orders.length > 0) {
			return <h2 className='text-danger'>Total Orders : {orders.length}</h2>;
		} else {
			return <h2 className='text-danger'>No Orders</h2>;
		}
	};

	const showInput = (key, value) => {
		return (
			<div className='input-group mr-2 mr-sm-2 mb-2'>
				<div className='input-group-prepend'>
					<div className='input-group-text'>{key}</div>
				</div>
				<input type='text' value={value} readOnly className='form-control' />
			</div>
		);
	};

	const handleStatusChange = (e, orderId) => {
		updateOrderStatus(user._id, token, e.target.value, orderId).then((data) => {
			if (data.error) {
				console.log('Status update unsuccessful!');
			} else {
				loadOrders();
			}
		});
	};

	const showStatus = (o) => {
		return (
			<div className='form-group'>
				<h3 className='mark mb-4'>STATUS : {o.status}</h3>
				<select className='form-control' onChange={(e) => handleStatusChange(e, o._id)}>
					<option>Update Status</option>
					{statusValues.map((status, index) => (
						<option key={index} value={status}>
							{status}
						</option>
					))}
				</select>
			</div>
		);
	};

	return (
		<div>
			<Layout title='Orders' description={`Welcome ${user.name}! Manage your orders.`}>
				<div className='row'>
					<div className='col-md-8 offset-md-2'>
						{showOrdersLength()}
						{orders.map((o, oIndex) => {
							return (
								<div className='mt-5' key={oIndex} style={{ borderBottom: '5px solid indigo' }}>
									<h3 className='mb-5'>
										<span className='bg-primary'>ORDER ID : {o._id} </span>
									</h3>
									<ul className='list-group mb-2'>
										<li className='list-group-item'>{showStatus(o)}</li>
										<li className='list-group-item'>TRANSACTION ID : {o.transaction_id}</li>
										<li className='list-group-item'>AMOUNT : ₹{o.amount}</li>
										<li className='list-group-item'>ORDERED BY : {o.user.name}</li>
										<li className='list-group-item'>
											ORDERED ON : {moment(o.createdAt).fromNow()}
										</li>
										<li className='list-group-item'>DELIVERY ADDRESS : {o.address}</li>
									</ul>
									<h4 className='mt-4 mb-4 font-italic'>
										Total products in the order : {o.products.length}
									</h4>
									{o.products.map((p, pIndex) => {
										return (
											<div
												className='mb-4'
												key={pIndex}
												style={{ padding: '20px', border: '1px solid indigo' }}
											>
												{showInput('Product name', p.name)}
												{showInput('Product price', p.price)}
												{showInput('Product total', p.count)}
												{showInput('Product id', p._id)}
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default Orders;
