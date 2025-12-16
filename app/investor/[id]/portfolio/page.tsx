import React from "react";

export default function PortfolioPage({ params }: { params: { id: string } }) {
	return (
		<div className="p-4">
			<h1 className="text-xl font-semibold">Investor Portfolio</h1>
			<p className="text-gray-600">Investor ID: {params.id}</p>
		</div>
	);
}

