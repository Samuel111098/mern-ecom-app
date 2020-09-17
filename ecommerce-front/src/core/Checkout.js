import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts, getBraintreeClientToken, processPayment } from './ApiCore';
import { isAuthenticated } from '../auth/index';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import { emptyCart } from './cartHelpers';

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
	const [ data, setData ] = useState({
		loading: false,
		success: false,
		clientToken: null,
		error: '',
		instance: {},
		address: ''
	});
	const userId = isAuthenticated() && isAuthenticated().user._id;
	const token = isAuthenticated() && isAuthenticated().token;

	const getToken = (userId, token) => {
		getBraintreeClientToken(userId, token).then((data) => {
			if (data.error) {
				setData({ ...data, error: data.error });
			} else {
				setData({ clientToken: data.clientToken });
			}
		});
	};

	useEffect(() => {
		getToken(userId, token);
	}, []);

	const getTotal = () => {
		return products.reduce((currentValue, nextValue) => {
			return currentValue + nextValue.count * nextValue.price;
		}, 0);
	};
	const showCheckout = () => {
		return isAuthenticated() ? (
			<div className='container'>{showDropIn()}</div>
		) : (
			<Link to='signin'>
				<button className='btn btn-primary'>Sign in to Checkout</button>
			</Link>
		);
	};

	const buy = () => {
		setData({ ...data, loading: true });
		let nonce;
		nonce = data.instance
			.requestPaymentMethod()
			.then((data) => {
				// console.log(data);
				nonce = data.nonce;
				// console.log('send nonce and total : ', nonce, getTotal(products));
				const paymentData = {
					paymentMethodNonce: nonce,
					amount: getTotal(products)
				};
				processPayment(userId, token, paymentData)
					.then((response) => {
						setData({ ...data, success: response.success });
						emptyCart(() => {
							setRun(!run);
							console.log('Payment Successful');
							setData({ loading: false });
						});
					})
					.catch((error) => {
						console.log(error);
						setData({ loading: false });
					});
			})
			.catch((error) => {
				// console.log('DropIn error: ', error);
				setData({ ...data, error: error.message });
			});
	};

	const showDropIn = () => {
		return (
			<div onBlur={() => setData({ ...data, error: '' })}>
				{data.clientToken !== null && products.length > 0 ? (
					<div>
						<DropIn
							options={{
								authorization: data.clientToken
								// paypal: {
								// 	flow: 'vault'
								// }
							}}
							onInstance={(instance) => (data.instance = instance)}
						/>
						<button onClick={buy} className='btn btn-success btn-block'>
							Pay Now
						</button>
					</div>
				) : null}
			</div>
		);
	};

	const showError = (error) => {
		return (
			<div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
				{error}
			</div>
		);
	};

	const showSuccess = (success) => {
		return (
			<div className='alert alert-info' style={{ display: success ? '' : 'none' }}>
				Thanks! Your Payment was Successful.
			</div>
		);
	};

	const showLoading = (loading) => loading && <h2>Loading....</h2>;

	return (
		<div>
			<h1 className='mb-3'>TOTAL: ₹{getTotal()}</h1>
			{showLoading(data.loading)}
			{showError(data.error)}
			{showSuccess(data.success)}
			{showCheckout()}
		</div>
	);
};

export default Checkout;
