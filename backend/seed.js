const pool = require("./config/db");

const categories = [
  { name: "Electronics", image_url: "https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png" },
  { name: "Mobiles", image_url: "https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png" },
  { name: "Fashion", image_url: "https://rukminim2.flixcart.com/flap/128/128/image/c12afc017e6f24cb.png" },
  { name: "Home & Furniture", image_url: "https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg" },
  { name: "Appliances", image_url: "https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png" },
  { name: "Books", image_url: "https://rukminim2.flixcart.com/flap/128/128/image/71050627a56b4693.png" },
];

const products = [
  // ── MOBILES ──────────────────────────────────────────────────────────
  {
    name: "Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)",
    description: "Experience the ultimate Galaxy with the S24 Ultra featuring a built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor.",
    price: 124999, mrp: 134999, rating: 4.5, rating_count: 12840,
    stock: 50, category: "Mobiles", brand: "Samsung",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/s/n/y/-original-imagguwffhxzsgn5.jpeg",
      "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/d/k/i/-original-imagguwf3fqhvxzh.jpeg",
      "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/j/c/3/-original-imagguwfhtyshgrb.jpeg"
    ]),
    specifications: JSON.stringify({ "Display": "6.8 inch QHD+", "Processor": "Snapdragon 8 Gen 3", "RAM": "12 GB", "Storage": "256 GB", "Camera": "200 MP + 12 MP + 10 MP + 50 MP", "Battery": "5000 mAh", "OS": "Android 14" })
  },
  {
    name: "Apple iPhone 15 (Blue, 128GB)",
    description: "iPhone 15 features a 48MP main camera, Dynamic Island, USB-C connector, and A16 Bionic chip for incredible performance.",
    price: 69999, mrp: 79900, rating: 4.6, rating_count: 23451,
    stock: 80, category: "Mobiles", brand: "Apple",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/d/o/r/-original-imaghx9kfhgcphzu.jpeg",
      "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/r/o/t/-original-imaghx9kpgx9bvhq.jpeg"
    ]),
    specifications: JSON.stringify({ "Display": "6.1 inch Super Retina XDR", "Processor": "A16 Bionic", "RAM": "6 GB", "Storage": "128 GB", "Camera": "48 MP + 12 MP", "Battery": "3349 mAh", "OS": "iOS 17" })
  },
  {
    name: "OnePlus 12 5G (Flowy Emerald, 256GB)",
    description: "Powered by Snapdragon 8 Gen 3, Hasselblad camera system, 100W SUPERVOOC charging and 50W wireless charging.",
    price: 64999, mrp: 69999, rating: 4.4, rating_count: 8932,
    stock: 60, category: "Mobiles", brand: "OnePlus",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/x/h/u/-original-imagrgfgmzhy6hfm.jpeg",
      "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/c/i/d/-original-imagrgfgczhbkm5u.jpeg"
    ]),
    specifications: JSON.stringify({ "Display": "6.82 inch AMOLED 120Hz", "Processor": "Snapdragon 8 Gen 3", "RAM": "12 GB", "Storage": "256 GB", "Camera": "50 MP + 48 MP + 64 MP", "Battery": "5400 mAh", "OS": "Android 14" })
  },
  {
    name: "Redmi Note 13 Pro+ 5G (Aurora Purple, 256GB)",
    description: "200MP HPX OIS camera, 120W HyperCharge, Curved AMOLED display — all at an unbeatable price.",
    price: 31999, mrp: 38999, rating: 4.3, rating_count: 15670,
    stock: 120, category: "Mobiles", brand: "Redmi",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/a/a/e/-original-imagr3gqhvepnmhg.jpeg"
    ]),
    specifications: JSON.stringify({ "Display": "6.67 inch Curved AMOLED 120Hz", "Processor": "MediaTek Dimensity 7200 Ultra", "RAM": "8 GB", "Storage": "256 GB", "Camera": "200 MP + 8 MP + 2 MP", "Battery": "5000 mAh", "OS": "Android 13" })
  },

  // ── ELECTRONICS ───────────────────────────────────────────────────────
  {
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Industry-leading noise cancellation, 30-hour battery life, and exceptional sound quality with the WH-1000XM5.",
    price: 26990, mrp: 34990, rating: 4.7, rating_count: 5621,
    stock: 40, category: "Electronics", brand: "Sony",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/z/e/r/-original-imaghyzkfb5gnhfr.jpeg",
      "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/b/p/y/-original-imaghyzkzge8phhq.jpeg"
    ]),
    specifications: JSON.stringify({ "Type": "Over-Ear", "Connectivity": "Bluetooth 5.2", "Battery Life": "30 hours", "Noise Cancelling": "Yes", "Weight": "250g", "Foldable": "Yes" })
  },
  {
    name: "Apple MacBook Air M2 (13.6 inch, 8GB, 256GB SSD)",
    description: "Supercharged by the M2 chip, MacBook Air is impossibly thin with a 18-hour battery and stunning Liquid Retina display.",
    price: 99900, mrp: 119900, rating: 4.7, rating_count: 7823,
    stock: 25, category: "Electronics", brand: "Apple",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/q/q/7/-original-imaghgessfhgmx7g.jpeg",
      "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/e/d/v/-original-imaghgeszghzuq4v.jpeg"
    ]),
    specifications: JSON.stringify({ "Processor": "Apple M2", "RAM": "8 GB", "Storage": "256 GB SSD", "Display": "13.6 inch Liquid Retina", "Battery": "Up to 18 hours", "OS": "macOS Ventura", "Weight": "1.24 kg" })
  },
  {
    name: "LG 55 inch 4K UHD Smart OLED TV",
    description: "Experience perfect blacks and infinite contrast with LG OLED evo. Powered by α9 AI Processor 4K Gen6.",
    price: 129999, mrp: 189999, rating: 4.5, rating_count: 3210,
    stock: 15, category: "Electronics", brand: "LG",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/television/u/k/d/-original-imagr4he5gkdnvze.jpeg"
    ]),
    specifications: JSON.stringify({ "Screen Size": "55 inch", "Resolution": "4K UHD 3840x2160", "Panel": "OLED evo", "HDR": "Dolby Vision, HDR10", "Smart TV": "webOS 23", "Refresh Rate": "120Hz", "HDMI Ports": "4" })
  },
  {
    name: "boAt Rockerz 450 Bluetooth Headphones",
    description: "40mm dynamic drivers, 15-hour playback, soft padded ear cushions and foldable design for everyday use.",
    price: 1499, mrp: 4490, rating: 4.1, rating_count: 89234,
    stock: 300, category: "Electronics", brand: "boAt",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/kpf8dyw0/headphone/g/s/e/rockerz-450-boat-original-imag2wyp2wvkmpvz.jpeg"
    ]),
    specifications: JSON.stringify({ "Type": "Over-Ear", "Connectivity": "Bluetooth 5.0", "Battery Life": "15 hours", "Driver Size": "40mm", "Foldable": "Yes", "Mic": "Yes" })
  },

  // ── FASHION ────────────────────────────────────────────────────────────
  {
    name: "Levi's Men's Slim Fit Jeans (Blue, 32W x 32L)",
    description: "Classic 5-pocket styling with Levi's signature slim fit. Made from stretch denim for all-day comfort.",
    price: 2099, mrp: 3999, rating: 4.3, rating_count: 34521,
    stock: 200, category: "Fashion", brand: "Levi's",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/jean/c/c/1/-original-imaghkghkknukxze.jpeg"
    ]),
    specifications: JSON.stringify({ "Fit": "Slim", "Fabric": "98% Cotton, 2% Elastane", "Closure": "Zip Fly", "Pockets": "5", "Wash": "Machine Wash" })
  },
  {
    name: "Nike Air Force 1 '07 Sneakers (White, UK 9)",
    description: "The radiant Nike Air Force 1 '07 brings you legendary AF-1 style with modern materials and color.",
    price: 7495, mrp: 8995, rating: 4.6, rating_count: 12300,
    stock: 80, category: "Fashion", brand: "Nike",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/shoe/s/y/i/-original-imaghf5gd5xxscsg.jpeg"
    ]),
    specifications: JSON.stringify({ "Upper": "Leather", "Sole": "Rubber", "Closure": "Lace-up", "Occasion": "Casual", "Color": "White" })
  },

  // ── HOME & FURNITURE ──────────────────────────────────────────────────
  {
    name: "Solimo Engineered Wood 3-Door Wardrobe (Walnut Finish)",
    description: "Spacious 3-door wardrobe with hanging rod, shelves, and a full-length mirror. Easy to assemble.",
    price: 12999, mrp: 25000, rating: 4.2, rating_count: 4521,
    stock: 30, category: "Home & Furniture", brand: "Solimo",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/wardrobe/q/3/a/-original-imaghfm3hhszzryz.jpeg"
    ]),
    specifications: JSON.stringify({ "Material": "Engineered Wood", "Doors": "3", "Color": "Walnut", "Mirror": "Yes", "Assembly": "Required", "Dimensions": "150 x 52 x 182 cm" })
  },
  {
    name: "Pigeon by Stovekraft 1.5 Litre Electric Kettle",
    description: "1500W rapid boil kettle with auto shut-off, boil-dry protection and 1.5L capacity.",
    price: 699, mrp: 1495, rating: 4.3, rating_count: 67890,
    stock: 500, category: "Home & Furniture", brand: "Pigeon",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/jzfcpe80/electric-kettle/r/h/g/quartz-1500w-1-5l-pigeon-original-imafb3fyjhx4fcqy.jpeg"
    ]),
    specifications: JSON.stringify({ "Capacity": "1.5 Litre", "Power": "1500W", "Auto Shut-off": "Yes", "Material": "Stainless Steel", "Cord Length": "60 cm" })
  },

  // ── APPLIANCES ────────────────────────────────────────────────────────
  {
    name: "Samsung 253L 3 Star Inverter Frost Free Double Door Refrigerator",
    description: "Digital Inverter Technology, All-round Cooling, Deodorizer, and Twin Cooling Plus for fresher food longer.",
    price: 27990, mrp: 38000, rating: 4.4, rating_count: 9870,
    stock: 20, category: "Appliances", brand: "Samsung",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/refrigerator-new/s/b/e/-original-imaghfgnzgh6yhjz.jpeg"
    ]),
    specifications: JSON.stringify({ "Capacity": "253 Litres", "Type": "Double Door", "Star Rating": "3 Star", "Inverter Compressor": "Yes", "Frost Free": "Yes", "Annual Energy Consumption": "190 Units" })
  },
  {
    name: "LG 7 Kg 5 Star Inverter Fully Automatic Top Load Washing Machine",
    description: "Smart Inverter Motor, TurboDrum, Auto Restart and Child Lock for a safe, efficient wash.",
    price: 19490, mrp: 28000, rating: 4.3, rating_count: 6540,
    stock: 18, category: "Appliances", brand: "LG",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/k/h/y/-original-imaghq7yqhgagkvz.jpeg"
    ]),
    specifications: JSON.stringify({ "Capacity": "7 Kg", "Type": "Fully Automatic Top Load", "Star Rating": "5 Star", "Inverter Motor": "Yes", "Wash Programs": "8", "Spin Speed": "700 RPM" })
  },

  // ── BOOKS ─────────────────────────────────────────────────────────────
  {
    name: "Atomic Habits by James Clear (Paperback)",
    description: "An easy and proven way to build good habits and break bad ones. Over 15 million copies sold worldwide.",
    price: 399, mrp: 699, rating: 4.7, rating_count: 124530,
    stock: 1000, category: "Books", brand: "Penguin",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/book/7/5/0/atomic-habits-original-imafymqzjaz9anff.jpeg"
    ]),
    specifications: JSON.stringify({ "Author": "James Clear", "Publisher": "Penguin Random House", "Pages": "320", "Language": "English", "Binding": "Paperback", "ISBN": "978-1847941831" })
  },
  {
    name: "Rich Dad Poor Dad by Robert T. Kiyosaki",
    description: "The #1 Personal Finance book of all time. What the rich teach their kids about money that the poor do not.",
    price: 249, mrp: 495, rating: 4.6, rating_count: 98760,
    stock: 1000, category: "Books", brand: "Plata Publishing",
    images: JSON.stringify([
      "https://rukminim2.flixcart.com/image/416/416/book/7/6/5/rich-dad-poor-dad-original-imad7azbcnb3cgbf.jpeg",
      "/rich-dad.webp"
    ]),
    specifications: JSON.stringify({ "Author": "Robert T. Kiyosaki", "Publisher": "Plata Publishing", "Pages": "336", "Language": "English", "Binding": "Paperback" })
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Insert categories
    const categoryMap = {};
    for (const cat of categories) {
      const [result] = await pool.execute(
        "INSERT INTO categories (name, image_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_url = VALUES(image_url)",
        [cat.name, cat.image_url]
      );
      // Fetch the id (in case of duplicate key update)
      const [rows] = await pool.execute("SELECT id FROM categories WHERE name = ?", [cat.name]);
      categoryMap[cat.name] = rows[0].id;
    }
    console.log("✅ Categories seeded:", Object.keys(categoryMap).join(", "));

    // Insert products
    for (const p of products) {
      const catId = categoryMap[p.category];
      await pool.execute(
        `INSERT INTO products 
          (name, description, price, mrp, rating, rating_count, stock, category_id, brand, images, specifications)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           price = VALUES(price),
           mrp = VALUES(mrp),
           rating = VALUES(rating),
           rating_count = VALUES(rating_count),
           stock = VALUES(stock),
           brand = VALUES(brand),
           description = VALUES(description),
           images = VALUES(images),
           specifications = VALUES(specifications)`,
        [p.name, p.description, p.price, p.mrp, p.rating, p.rating_count, p.stock, catId, p.brand, p.images, p.specifications]
      );
    }
    console.log(`✅ ${products.length} products seeded`);
    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();