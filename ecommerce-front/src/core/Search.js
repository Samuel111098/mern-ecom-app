import React, { useState, useEffect } from 'react';
import { getCategories, list } from './ApiCore';
import Card from './Card';

const Search = () => {
	const [ data, setData ] = useState({
		categories: [],
		category: '',
		search: '',
		results: [],
		searched: false
	});

	const { categories, category, search, results, searched } = data;

	const loadCategories = () => {
		getCategories().then((data) => {
			if (data.error) {
				return console.log(data.error);
			} else {
				setData({ ...data, categories: data });
			}
		});
	};

	useEffect(() => {
		loadCategories();
	}, []);

	const handleChange = (name) => (event) => {
		setData({ ...data, [name]: event.target.value, searched: false });
	};

	const searchData = () => {
		if (search) {
			list({ search: search || undefined, category: category }).then((response) => {
				if (response.error) {
					return console.log(response.error);
				} else {
					setData({ ...data, results: response, searched: true });
				}
			});
		}
	};

	const searchSumbit = (e) => {
		e.preventDefault();
		searchData();
	};

	const searchMessage = (searched, results) => {
		if (searched && results.length > 0) {
			return `Found ${results.length} products`;
		}
		if (searched && results.length < 1) {
			return `No products found`;
		}
	};

	const searchedProducts = (results = []) => {
		return (
			<div>
				<h2 className='mt-2 mb-4'>{searchMessage(searched, results)}</h2>

				<div className='row'>{results.map((product, i) => <Card key={i} product={product} />)}</div>
			</div>
		);
	};

	const searchForm = () => (
		<form onSubmit={searchSumbit}>
			<span className='input-group-text'>
				<div className='input-group input-group-lg'>
					<div className='input-group-prepend'>
						<select onChange={handleChange('category')} className='btn mr-2'>
							<option value='All'>All</option>
							{categories.map((c, i) => (
								<option key={i} value={c._id}>
									{c.name}
								</option>
							))}
						</select>
					</div>
					<input
						type='search'
						className='form-control'
						onChange={handleChange('search')}
						placeholder='Enter to Search'
					/>
				</div>
				<div className='btn input-group-append' style={{ border: 'none' }}>
					<button type='submit' className='input-group-text'>
						Search
					</button>
				</div>
			</span>
		</form>
	);

	return (
		<div className='row'>
			<div className='container mb-5'>{searchForm()}</div>
			<div className='container-fluid mb-5'>{searchedProducts(results)}</div>
		</div>
	);
};

export default Search;
