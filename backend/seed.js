// This is a ONE-TIME script. It reads all our existing place data
// (the same data that was sitting in explore.html) and saves it
// properly into MongoDB, using the Place model we just created.

const mongoose = require("mongoose");
require("dotenv").config();
const Place = require("./models/Place");

// STEP 1: All our existing data, grouped by state - same as before.
// The 3 places with full details (Taj Mahal, Golden Temple, Mehrangarh Fort)
// keep their extra fields. Everything else has the basic fields only -
// the extra fields will just be empty for now, and that's fine.
const stateData = {
  "Andhra Pradesh": [
    { name: "Tirupati Balaji Temple", city: "Tirupati", category: "Religious" },
    { name: "Araku Valley", city: "Araku", category: "Nature" },
    { name: "Borra Caves", city: "Ananthagiri", category: "Nature" },
    { name: "Visakhapatnam Beach", city: "Visakhapatnam", category: "Nature" },
    { name: "Lepakshi Temple", city: "Lepakshi", category: "Heritage" },
    { name: "Undavalli Caves", city: "Vijayawada", category: "Heritage" }
  ],
  "Arunachal Pradesh": [
    { name: "Tawang Monastery", city: "Tawang", category: "Heritage" },
    { name: "Ziro Valley", city: "Ziro", category: "Nature" },
    { name: "Sela Pass", city: "Tawang", category: "Adventure" },
    { name: "Bomdila Monastery", city: "Bomdila", category: "Religious" },
    { name: "Namdapha National Park", city: "Changlang", category: "Nature" }
  ],
  "Assam": [
    { name: "Kaziranga National Park", city: "Kaziranga", category: "Nature" },
    { name: "Kamakhya Temple", city: "Guwahati", category: "Religious" },
    { name: "Majuli Island", city: "Majuli", category: "Nature" },
    { name: "Sivasagar", city: "Sivasagar", category: "Heritage" },
    { name: "Manas National Park", city: "Barpeta", category: "Nature" },
    { name: "Umananda Temple", city: "Guwahati", category: "Religious" }
  ],
  "Bihar": [
    { name: "Mahabodhi Temple", city: "Bodh Gaya", category: "Religious" },
    { name: "Nalanda Ruins", city: "Nalanda", category: "Heritage" },
    { name: "Patna Sahib Gurdwara", city: "Patna", category: "Religious" },
    { name: "Vaishali", city: "Vaishali", category: "Heritage" },
    { name: "Rajgir", city: "Rajgir", category: "Heritage" },
    { name: "Barabar Caves", city: "Jehanabad", category: "Heritage" }
  ],
  "Chhattisgarh": [
    { name: "Chitrakoot Falls", city: "Bastar", category: "Nature" },
    { name: "Bastar Palace", city: "Jagdalpur", category: "Heritage" },
    { name: "Sirpur", city: "Sirpur", category: "Heritage" },
    { name: "Kanger Valley National Park", city: "Jagdalpur", category: "Nature" },
    { name: "Bhoramdeo Temple", city: "Kabirdham", category: "Religious" }
  ],
  "Goa": [
    { name: "Baga Beach", city: "North Goa", category: "Nature" },
    { name: "Basilica of Bom Jesus", city: "Old Goa", category: "Heritage" },
    { name: "Dudhsagar Falls", city: "Sanguem", category: "Nature" },
    { name: "Fort Aguada", city: "Candolim", category: "Heritage" },
    { name: "Palolem Beach", city: "South Goa", category: "Nature" },
    { name: "Se Cathedral", city: "Old Goa", category: "Heritage" },
    { name: "Anjuna Flea Market", city: "Anjuna", category: "Heritage" }
  ],
  "Gujarat": [
    { name: "Statue of Unity", city: "Kevadia", category: "Heritage" },
    { name: "Rann of Kutch", city: "Kutch", category: "Nature" },
    { name: "Somnath Temple", city: "Somnath", category: "Religious" },
    { name: "Sabarmati Ashram", city: "Ahmedabad", category: "Heritage" },
    { name: "Gir National Park", city: "Junagadh", category: "Nature" },
    { name: "Dwarkadhish Temple", city: "Dwarka", category: "Religious" },
    { name: "Laxmi Vilas Palace", city: "Vadodara", category: "Heritage" }
  ],
  "Haryana": [
    { name: "Kurukshetra", city: "Kurukshetra", category: "Religious" },
    { name: "Sultanpur Bird Sanctuary", city: "Gurugram", category: "Nature" },
    { name: "Pinjore Gardens", city: "Pinjore", category: "Nature" },
    { name: "Sheikh Chilli's Tomb", city: "Kurukshetra", category: "Heritage" },
    { name: "Morni Hills", city: "Panchkula", category: "Nature" }
  ],
  "Himachal Pradesh": [
    { name: "Rohtang Pass", city: "Manali", category: "Adventure" },
    { name: "Hadimba Temple", city: "Manali", category: "Religious" },
    { name: "Kufri Slopes", city: "Shimla", category: "Adventure" },
    { name: "Dharamshala & McLeod Ganj", city: "Dharamshala", category: "Heritage" },
    { name: "Spiti Valley", city: "Spiti", category: "Nature" },
    { name: "Kasol", city: "Kasol", category: "Nature" },
    { name: "Chail", city: "Chail", category: "Nature" },
    { name: "Bir Billing", city: "Bir", category: "Adventure" }
  ],
  "Jharkhand": [
    { name: "Betla National Park", city: "Latehar", category: "Nature" },
    { name: "Baidyanath Temple", city: "Deoghar", category: "Religious" },
    { name: "Hundru Falls", city: "Ranchi", category: "Nature" },
    { name: "Netarhat", city: "Latehar", category: "Nature" },
    { name: "Parasnath Hill", city: "Giridih", category: "Religious" }
  ],
  "Karnataka": [
    { name: "Hampi Ruins", city: "Hampi", category: "Heritage" },
    { name: "Mysore Palace", city: "Mysore", category: "Heritage" },
    { name: "Coorg Hills", city: "Coorg", category: "Nature" },
    { name: "Gokarna Beach", city: "Gokarna", category: "Nature" },
    { name: "Jog Falls", city: "Shimoga", category: "Nature" },
    { name: "Badami Caves", city: "Badami", category: "Heritage" },
    { name: "Bandipur National Park", city: "Bandipur", category: "Nature" }
  ],
  "Kerala": [
    { name: "Alleppey Backwaters", city: "Alappuzha", category: "Nature" },
    { name: "Munnar Tea Gardens", city: "Munnar", category: "Nature" },
    { name: "Padmanabhaswamy Temple", city: "Thiruvananthapuram", category: "Religious" },
    { name: "Fort Kochi", city: "Kochi", category: "Heritage" },
    { name: "Wayanad Hills", city: "Wayanad", category: "Nature" },
    { name: "Thekkady Wildlife Sanctuary", city: "Thekkady", category: "Nature" },
    { name: "Varkala Beach", city: "Varkala", category: "Nature" },
    { name: "Kovalam Beach", city: "Kovalam", category: "Nature" }
  ],
  "Madhya Pradesh": [
    { name: "Khajuraho Temples", city: "Khajuraho", category: "Heritage" },
    { name: "Kanha National Park", city: "Kanha", category: "Nature" },
    { name: "Sanchi Stupa", city: "Sanchi", category: "Heritage" },
    { name: "Bandhavgarh National Park", city: "Umaria", category: "Nature" },
    { name: "Gwalior Fort", city: "Gwalior", category: "Heritage" },
    { name: "Orchha", city: "Orchha", category: "Heritage" },
    { name: "Pachmarhi", city: "Pachmarhi", category: "Nature" }
  ],
  "Maharashtra": [
    { name: "Ajanta & Ellora Caves", city: "Aurangabad", category: "Heritage" },
    { name: "Gateway of India", city: "Mumbai", category: "Heritage" },
    { name: "Lonavala Hills", city: "Lonavala", category: "Nature" },
    { name: "Shirdi", city: "Shirdi", category: "Religious" },
    { name: "Mahabaleshwar", city: "Mahabaleshwar", category: "Nature" },
    { name: "Elephanta Caves", city: "Mumbai", category: "Heritage" },
    { name: "Shaniwar Wada", city: "Pune", category: "Heritage" }
  ],
  "Manipur": [
    { name: "Loktak Lake", city: "Moirang", category: "Nature" },
    { name: "Kangla Fort", city: "Imphal", category: "Heritage" },
    { name: "Shirui Hills", city: "Ukhrul", category: "Nature" },
    { name: "Khonghampat Orchidarium", city: "Imphal", category: "Nature" },
    { name: "Ima Keithel Market", city: "Imphal", category: "Heritage" }
  ],
  "Meghalaya": [
    { name: "Living Root Bridges", city: "Cherrapunji", category: "Nature" },
    { name: "Cherrapunji Falls", city: "Cherrapunji", category: "Nature" },
    { name: "Dawki River", city: "Dawki", category: "Nature" },
    { name: "Shillong Peak", city: "Shillong", category: "Nature" },
    { name: "Mawsmai Cave", city: "Cherrapunji", category: "Adventure" }
  ],
  "Mizoram": [
    { name: "Reiek Hills", city: "Reiek", category: "Nature" },
    { name: "Vantawng Falls", city: "Thenzawl", category: "Nature" },
    { name: "Solomon's Temple", city: "Aizawl", category: "Religious" },
    { name: "Tam Dil Lake", city: "Saitual", category: "Nature" }
  ],
  "Nagaland": [
    { name: "Kohima War Cemetery", city: "Kohima", category: "Heritage" },
    { name: "Dzukou Valley", city: "Kohima", category: "Nature" },
    { name: "Hornbill Festival Grounds", city: "Kisama", category: "Heritage" },
    { name: "Japfu Peak", city: "Kohima", category: "Adventure" },
    { name: "Khonoma Village", city: "Kohima", category: "Heritage" }
  ],
  "Odisha": [
    { name: "Konark Sun Temple", city: "Konark", category: "Heritage" },
    { name: "Jagannath Temple", city: "Puri", category: "Religious" },
    { name: "Chilika Lake", city: "Puri", category: "Nature" },
    { name: "Udayagiri & Khandagiri Caves", city: "Bhubaneswar", category: "Heritage" },
    { name: "Simlipal National Park", city: "Mayurbhanj", category: "Nature" },
    { name: "Lingaraj Temple", city: "Bhubaneswar", category: "Religious" }
  ],
  "Punjab": [
    {
      name: "Golden Temple", city: "Amritsar", category: "Religious",
      description: "Also known as Harmandir Sahib, this is the holiest gurdwara of Sikhism. Built around a sacred pool, its upper floor is covered in gold, giving it its name. It welcomes visitors of all faiths.",
      timings: "Open daily, roughly 3:00 AM to 10:00 PM (the complex and langar hall run extended hours).",
      entryFee: "Free for all visitors.",
      bestTime: "October to March",
      famousFood: "Amritsari Kulcha, Lassi, and free community meals (langar) served inside the temple complex",
      nearby: "Jallianwala Bagh, Wagah Border, Durgiana Temple",
      transport: "Nearest airport: Sri Guru Ram Dass Jee International Airport (~13 km). Nearest railway station: Amritsar Junction (~2 km)."
    },
    { name: "Jallianwala Bagh", city: "Amritsar", category: "Heritage" },
    { name: "Wagah Border", city: "Attari", category: "Heritage" },
    { name: "Anandpur Sahib", city: "Rupnagar", category: "Religious" },
    { name: "Qila Mubarak", city: "Patiala", category: "Heritage" }
  ],
  "Rajasthan": [
    {
      name: "Mehrangarh Fort", city: "Jodhpur", category: "Heritage",
      description: "One of India's largest forts, built in 1459 by Rao Jodha on a hill 400 feet above Jodhpur. It houses palaces, courtyards, and a museum of royal artifacts, and offers panoramic views of the Blue City.",
      timings: "Daily, 9:00 AM to 5:00 PM.",
      entryFee: "Approx. ₹100-200 for Indian citizens, ₹600-800 for foreign tourists (varies by season/offer - check official site before visiting).",
      bestTime: "October to March",
      famousFood: "Makhaniya Lassi, Mirchi Bada, Pyaaz Kachori",
      nearby: "Jaswant Thada, Umaid Bhawan Palace, Sardar Market & Clock Tower",
      transport: "Nearest airport: Jodhpur Airport (~5 km). Nearest railway station: Jodhpur Junction (~5 km)."
    },
    { name: "Lake Pichola", city: "Udaipur", category: "Nature" },
    { name: "Jaisalmer Fort", city: "Jaisalmer", category: "Heritage" },
    { name: "Amber Fort", city: "Jaipur", category: "Heritage" },
    { name: "Pushkar Lake", city: "Pushkar", category: "Religious" },
    { name: "Hawa Mahal", city: "Jaipur", category: "Heritage" },
    { name: "City Palace", city: "Udaipur", category: "Heritage" },
    { name: "Thar Desert Safari", city: "Jaisalmer", category: "Adventure" },
    { name: "Ranthambore National Park", city: "Sawai Madhopur", category: "Nature" },
    { name: "Chittorgarh Fort", city: "Chittorgarh", category: "Heritage" },
    { name: "Nahargarh Fort", city: "Jaipur", category: "Heritage" }
  ],
  "Sikkim": [
    { name: "Tsomgo Lake", city: "Gangtok", category: "Nature" },
    { name: "Nathula Pass", city: "Gangtok", category: "Adventure" },
    { name: "Rumtek Monastery", city: "Gangtok", category: "Religious" },
    { name: "Yumthang Valley", city: "Lachung", category: "Nature" },
    { name: "Pelling", city: "Pelling", category: "Nature" }
  ],
  "Tamil Nadu": [
    { name: "Meenakshi Temple", city: "Madurai", category: "Religious" },
    { name: "Ooty Hills", city: "Ooty", category: "Nature" },
    { name: "Shore Temple", city: "Mahabalipuram", category: "Heritage" },
    { name: "Kodaikanal", city: "Kodaikanal", category: "Nature" },
    { name: "Brihadeeswarar Temple", city: "Thanjavur", category: "Heritage" },
    { name: "Marina Beach", city: "Chennai", category: "Nature" },
    { name: "Kanyakumari", city: "Kanyakumari", category: "Nature" }
  ],
  "Telangana": [
    { name: "Charminar", city: "Hyderabad", category: "Heritage" },
    { name: "Golconda Fort", city: "Hyderabad", category: "Heritage" },
    { name: "Ramoji Film City", city: "Hyderabad", category: "Adventure" },
    { name: "Warangal Fort", city: "Warangal", category: "Heritage" },
    { name: "Bhadrakali Temple", city: "Warangal", category: "Religious" }
  ],
  "Tripura": [
    { name: "Ujjayanta Palace", city: "Agartala", category: "Heritage" },
    { name: "Neermahal", city: "Melaghar", category: "Heritage" },
    { name: "Unakoti Rock Carvings", city: "Unakoti", category: "Heritage" },
    { name: "Tripura Sundari Temple", city: "Udaipur", category: "Religious" }
  ],
  "Uttar Pradesh": [
    {
      name: "Taj Mahal", city: "Agra", category: "Heritage",
      description: "A white marble mausoleum built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal. Completed around 1653, it is one of the most famous buildings in the world and a UNESCO World Heritage Site.",
      timings: "Opens 30 minutes before sunrise, closes 30 minutes before sunset. Closed every Friday.",
      entryFee: "Indian citizens: ₹50 (+₹200 for the main mausoleum). Foreign tourists: ₹1,100 (+₹200 for the main mausoleum). Children under 15: Free.",
      bestTime: "October to March",
      famousFood: "Agra Petha (a sweet), Mughlai cuisine, Bedai with jalebi",
      nearby: "Agra Fort, Fatehpur Sikri, Mehtab Bagh",
      transport: "Nearest airport: Agra Airport (~13 km). Nearest railway station: Agra Cantt. Well connected by road and train from Delhi (about 3-4 hours)."
    },
    { name: "Varanasi Ghats", city: "Varanasi", category: "Religious" },
    { name: "Fatehpur Sikri", city: "Agra", category: "Heritage" },
    { name: "Ayodhya", city: "Ayodhya", category: "Religious" },
    { name: "Agra Fort", city: "Agra", category: "Heritage" },
    { name: "Mathura & Vrindavan", city: "Mathura", category: "Religious" },
    { name: "Sarnath", city: "Varanasi", category: "Heritage" },
    { name: "Lucknow Bara Imambara", city: "Lucknow", category: "Heritage" }
  ],
  "Uttarakhand": [
    { name: "Rishikesh", city: "Rishikesh", category: "Religious" },
    { name: "Nainital Lake", city: "Nainital", category: "Nature" },
    { name: "Valley of Flowers", city: "Chamoli", category: "Nature" },
    { name: "Kedarnath Temple", city: "Kedarnath", category: "Religious" },
    { name: "Jim Corbett National Park", city: "Nainital", category: "Nature" },
    { name: "Badrinath Temple", city: "Badrinath", category: "Religious" },
    { name: "Mussoorie", city: "Mussoorie", category: "Nature" }
  ],
  "West Bengal": [
    { name: "Victoria Memorial", city: "Kolkata", category: "Heritage" },
    { name: "Darjeeling Hills", city: "Darjeeling", category: "Nature" },
    { name: "Sundarbans", city: "South 24 Parganas", category: "Nature" },
    { name: "Howrah Bridge", city: "Kolkata", category: "Heritage" },
    { name: "Kalimpong", city: "Kalimpong", category: "Nature" },
    { name: "Dakshineswar Temple", city: "Kolkata", category: "Religious" }
  ]
};

// STEP 2: Connect to the database
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB. Starting to seed data...");

    // STEP 3: Turn our grouped data (by state) into one flat list,
    // adding the "state" field onto each place as we go.
    let allPlaces = [];
    for (const stateName in stateData) {
      const placesInState = stateData[stateName];
      placesInState.forEach(function (place) {
        allPlaces.push({
          ...place,          // copies all existing fields (name, city, category, etc.)
          state: stateName   // adds the state field
        });
      });
    }

    console.log("Total places to insert:", allPlaces.length);

    // STEP 4: Clear out any old data first, so we don't get duplicates
    // if we accidentally run this script twice.
    await Place.deleteMany({});
    console.log("Old data cleared.");

    // STEP 5: Insert everything into the database in one go.
    await Place.insertMany(allPlaces);
    console.log("All places inserted successfully!");

    // STEP 6: Close the connection and end the script.
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log("Something went wrong:");
    console.log(error);
  });