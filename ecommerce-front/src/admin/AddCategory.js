import React, { useState } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { createCategory } from './ApiAdmin';
import { Link } from 'react-router-dom';

const AddCategory = () => {
	const [ name, setName ] = useState('');
	const [ error, setError ] = useState(false);
	const [ success, setSuccess ] = useState(false);

	const { user, token } = isAuthenticated();

	const handleChange = (e) => {
		setError('');
		setName(e.target.value);
	};

	const clickSubmit = (e) => {
		e.preventDefault();
		setError('');
		setSuccess(false);
		// API call
		createCategory(user._id, token, { name }).then((data) => {
			if (data.error) {
				setError(true);
			} else {
				setError('');
				setSuccess(true);
			}
		});
	};

	const showSuccess = () => {
		if (success) {
			return (
				<div>
					<h3 className='text-success'>{name} is created!</h3>
				</div>
			);
		}
	};
	const showError = () => {
		if (error) {
			return (
				<div>
					<h3 className='text-danger'>Category should be unique!</h3>
				</div>
			);
		}
	};
	const goBack = () => (
		<div className='mt-5'>
			<Link to='/admin/dashboard' className='text-warning'>
				Back to dashboard
			</Link>
		</div>
	);

	const newCategoryForm = () => (
		<form onSubmit={clickSubmit}>
			<div className='form-group'>
				<label className='text-muted'>Name</label>
				<input
					type='text'
					className='form-control mb-3'
					onChange={handleChange}
					autoFocus
					required
					value={name}
				/>
			</div>
			<button className='btn btn-outline-primary'>Create Category</button>
		</form>
	);

	return (
		<div>
			<Layout title='Add new Category' description={`Welcome ${user.name}! Ready to create a new category?`}>
				<div className='row'>
					<div className='col-md-8 offset-md-2'>
						{showSuccess()}
						{showError()}
						{newCategoryForm()}
						{goBack()}
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default AddCategory;
