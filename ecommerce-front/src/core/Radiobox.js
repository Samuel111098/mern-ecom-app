import React, { useState, useEffect } from 'react';

const Radiobox = ({ prices, handleFilters }) => {
	const [ values, setValues ] = useState(0);

	const handleChange = (event) => {
		handleFilters(event.target.value);
		setValues(event.target.value);
	};

	return prices.map((p, i) => (
		<div key={i} className='mb-1'>
			<input value={`${p._id}`} name={p} onChange={handleChange} type='radio' className='mr-2 ml-4' />
			<label className='form-check-label'>{p.name}</label>
		</div>
	));
};

export default Radiobox;
