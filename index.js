// schema for product
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', },
    price: { type: Number, required: true },
    gender: { type: String, enum: ['men', 'women', 'boys', 'girls'], required: true },
    size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'] },
});

// shema for color 
const colorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hex: { type: String, required: true },
});


if (color) {
    filter.color = color;
}

if (gender) {
    filter.gender = gender;
}


// get products with filter

router.get('/', async (req, res) => {
    const { brand, category, color, gender, minPrice, maxPrice, search, size } = req.query;

    let filter = {};

    if (brand) {
        filter.brand = brand;
    }

    if (category) {
        filter.category = category;
    }

    if (color) {
        filter.color = color;
    }

    if (gender) {
        filter.gender = gender;
    }

    if (size) {
        filter.size = size;
    }

    if (minPrice && maxPrice) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
        filter.price = { $gte: minPrice };
    } else if (maxPrice) {
        filter.price = { $lte: maxPrice };
    }

    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    try {
        const products = await Product.find(filter).populate('brand category color');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

