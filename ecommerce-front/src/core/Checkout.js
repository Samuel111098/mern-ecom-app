import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from './ApiCore';
import { isAuthenticated } from '../auth/index';
import { Link } from 'react-router-dom';

const Checkout = ({ products }) => {
	const getTotal = () => {
		return products.reduce((currentValue, nextValue) => {
			return currentValue + nextValue.count * nextValue.price;
		}, 0);
	};
	const showCheckout = () => {
		return isAuthenticated() ? (
			<button className='btn btn-success'>Checkout</button>
		) : (
			<Link to='signin'>
				<button className='btn btn-primary'>Sign in to Checkout</button>
			</Link>
		);
	};
	return (
		<div>
			<h1 className='mb-3'>TOTAL: ₹{getTotal()}</h1>
			{showCheckout()}
		</div>
	);
};

export default Checkout;
