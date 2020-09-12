import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { createProduct, getCategories } from './ApiAdmin';
import { Link } from 'react-router-dom';

const AddProduct = () => {
	const { user, token } = isAuthenticated();
	const [ values, setValues ] = useState({
		name: '',
		description: '',
		price: '',
		categories: [],
		category: '',
		shipping: '',
		quantity: '',
		photo: '',
		loading: false,
		error: '',
		createdProduct: '',
		redirectToProfile: false,
		formData: ''
	});

	const {
		name,
		description,
		price,
		categories,
		category,
		shipping,
		quantity,
		photo,
		loading,
		error,
		createdProduct,
		redirectToProfile,
		formData
	} = values;

	const init = () => {
		getCategories().then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error });
			} else {
				setValues({ ...values, categories: data, formData: new FormData() });
			}
		});
	};

	useEffect(() => {
		init();
	}, []);

	const handleChange = (name) => (event) => {
		const value = name === 'photo' ? event.target.files[0] : event.target.value;
		formData.set(name, value);
		setValues({ ...values, [name]: value });
	};

	const clickSubmit = (event) => {
		event.preventDefault();
		setValues({ ...values, error: '', loading: true });
		createProduct(user._id, token, formData).then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error });
			} else {
				setValues({
					name: '',
					description: '',
					price: '',
					quantity: '',
					photo: '',
					loading: false,
					createdProduct: data.name
				});
			}
		});
	};

	const showError = () => (
		<div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
			{error}
		</div>
	);

	const showSuccess = () => (
		<div className='alert alert-info' style={{ display: createdProduct ? '' : 'none' }}>
			<h3>{`${createdProduct}`} has been created successfully!</h3>
		</div>
	);

	const showLoading = () =>
		loading && (
			<div className='alert alert-success'>
				<h2>Loading...</h2>
			</div>
		);

	const newPostForm = () => {
		return (
			<form className='mb-3' onSubmit={clickSubmit}>
				<h4>Photo Upload</h4>
				<div className='form-group'>
					<label className='btn btn-secondary'>
						<input onChange={handleChange('photo')} type='file' name='photo' accept='image/*' />
					</label>
				</div>
				<div className='form-group'>
					<label className='text-muted'>Name</label>
					<input onChange={handleChange('name')} type='text' className='form-control' value={name} />
				</div>
				<div className='form-group'>
					<label className='text-muted'>Description</label>
					<textarea onChange={handleChange('description')} className='form-control' value={description} />
				</div>
				<div className='form-group'>
					<label className='text-muted'>Price</label>
					<input onChange={handleChange('price')} type='number' className='form-control' value={price} />
				</div>
				<div className='form-group'>
					<label className='text-muted'>Categories</label>
					<select onChange={handleChange('category')} className='form-control'>
						<option>Please Select</option>
						{categories &&
							categories.map((c, i) => (
								<option key={i} value={c._id}>
									{c.name}
								</option>
							))}
					</select>
				</div>
				<div className='form-group'>
					<label className='text-muted'>Quantity</label>
					<input
						onChange={handleChange('quantity')}
						type='number'
						className='form-control'
						value={quantity}
					/>
				</div>
				<div className='form-group'>
					<label className='text-muted'>Shipping</label>
					<select onChange={handleChange('shipping')} className='form-control'>
						<option>Please Select</option>
						<option value='0'>No</option>
						<option value='1'>Yes</option>
					</select>
				</div>
				<button className='btn btn-outline-primary'>Create Product</button>
			</form>
		);
	};

	return (
		<div>
			<Layout title='Add new Product' description={`Welcome ${user.name}! Ready to create a new Product?`}>
				<div className='row'>
					<div className='col-md-8 offset-md-2'>
						{showLoading()}
						{showError()}
						{showSuccess()}
						{newPostForm()}
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default AddProduct;
