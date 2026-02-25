export default function Hero({ onSearch }) {
    return (
        <header className="hero">
            <div className="hero-content">
                <h1>Savor the <span className="highlight">Flavors</span> You Love</h1>
                <p>Experience a world of culinary delights right at your fingertips. Fresh, fast, and remarkably delicious.</p>
                <form className="hero-search-wrapper" onSubmit={(e) => { e.preventDefault(); onSearch(e.target.search.value); }}>
                    <input type="text" name="search" placeholder="Search for burgers, pizza, desserts..." />
                    <button type="submit"><i className="fas fa-search"></i></button>
                </form>
            </div>
            <div className="hero-image-overlay"></div>
        </header>
    );
}
