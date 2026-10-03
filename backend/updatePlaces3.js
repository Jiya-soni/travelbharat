// This script UPDATES existing places by name - it does NOT delete
// or duplicate anything. Safe to run independently of the other update files.

const mongoose = require("mongoose");
require("dotenv").config();
const Place = require("./models/Place");

// BATCH 17: Mizoram (all 4 places)
const updates = [
  {
    name: "Reiek Hills",
    details: {
      description: "One of the highest hills near Aizawl at about 1,465 metres, offering panoramic sunrise views over the Mizo hills, with a heritage village showcasing traditional Mizo culture at its base and a moderate 3-4 hour trek to the summit.",
      timings: "Open all day; sunrise trek typically starts around 4:00-5:00 AM to reach the summit by daybreak.",
      entryFee: "Free or minimal entry fee (typically under ₹50) at the heritage village and parking area. Note: Indian visitors from outside Mizoram require an Inner Line Permit (ILP), available online or at Aizawl/airport counters.",
      bestTime: "November to March",
      famousFood: "Mizo cuisine (Bai, Sawhchiar), tea and Maggi at the base tourist lodge",
      nearby: "Reiek Heritage Village, Aizawl city, Tam Dil Lake (day-trip distance)",
      transport: "Nearest airport: Lengpui Airport, Aizawl (~50 km). Reached by road from Aizawl (~30 km, about 1-2 hours)."
    }
  },
  {
    name: "Vantawng Falls",
    details: {
      description: "The tallest and widest waterfall in Mizoram, cascading in multiple tiers through dense forest near Thenzawl. Known as much for the scenic drive to reach it as for the falls themselves.",
      timings: "Approximately 8:00 AM to 5:00 PM daily (viewpoint access; no guide required).",
      entryFee: "Free or nominal entry fee (typically under ₹30-50).",
      bestTime: "October to April (monsoon offers the fullest flow but muddier access)",
      famousFood: "Mizo cuisine, local snacks available in nearby Thenzawl town",
      nearby: "Thenzawl town, Tan Ropui, local bamboo craft villages",
      transport: "Nearest airport: Lengpui Airport, Aizawl (~130 km). Reached by road via Thenzawl."
    }
  },
  {
    name: "Solomon's Temple",
    details: {
      description: "A large replica of the biblical Solomon's Temple built in Aizawl, reflecting the strong Christian heritage of Mizoram. One of the largest structures of its kind, used for prayer gatherings and religious events.",
      timings: "Approximately 8:00 AM to 6:00 PM daily (hours may vary around service times).",
      entryFee: "Free entry (donations welcome).",
      bestTime: "October to March",
      famousFood: "Mizo cuisine, local Aizawl street food and bakeries nearby",
      nearby: "Aizawl city center, Bara Bazaar, Mizoram State Museum",
      transport: "Nearest airport: Lengpui Airport, Aizawl (~35 km). Located within Aizawl city."
    }
  },
  {
    name: "Tam Dil Lake",
    details: {
      description: "A natural lake near Saitual, considered one of Mizoram's most picturesque spots, surrounded by forest and popular for boating, picnics, and its calm, scenic setting.",
      timings: "Approximately 8:00 AM to 5:00 PM daily.",
      entryFee: "Free or nominal entry fee (typically under ₹50); boating charged separately, typically ₹50-150 per person.",
      bestTime: "October to March",
      famousFood: "Mizo cuisine, local fish dishes, tea stalls near the lake",
      nearby: "Reiek Hills (day-trip distance), Saitual town, Aizawl city",
      transport: "Nearest airport: Lengpui Airport, Aizawl (~85 km). Reached by road from Aizawl via Saitual."
    }
  },

  // BATCH 18: Nagaland (all 5 places)
  {
    name: "Kohima War Cemetery",
    details: {
      description: "A solemn Commonwealth War Graves cemetery commemorating soldiers who died in the 1944 Battle of Kohima, a pivotal WWII battle often called the 'Stalingrad of the East'. Features terraced lawns and the famous Kohima Epitaph inscription.",
      timings: "Approximately 8:00 AM to 5:00 PM daily.",
      entryFee: "Free entry.",
      bestTime: "October to March",
      famousFood: "Naga cuisine (smoked pork, Axone/fermented soybean dishes), Kohima local eateries",
      nearby: "Kohima State Museum, Kohima Cathedral, Kisama Heritage Village",
      transport: "Nearest airport: Dimapur Airport (~74 km). Nearest railway station: Dimapur Railway Station (~74 km)."
    }
  },
  {
    name: "Dzukou Valley",
    details: {
      description: "A stunning high-altitude valley on the Manipur-Nagaland border, famous for rolling green hills, seasonal flowers (notably the rare Dzukou Lily), and a moderate-to-challenging trek popular with hikers.",
      timings: "Trek typically starts early morning; the trek to the valley from the base takes approximately 3-5 hours one way.",
      entryFee: "Nominal trekking/entry fee at the base (typically ₹50-100); Inner Line Permit required for Indian visitors from outside Nagaland.",
      bestTime: "June to September (for wildflowers, including the Dzukou Lily), October to April for clearer trekking weather",
      famousFood: "Naga cuisine, Maggi and basic supplies available at the trekkers' hut in the valley",
      nearby: "Kohima, Japfu Peak, Viswema village (common starting point)",
      transport: "Nearest airport: Dimapur Airport (~90 km). Base village reached by road from Kohima (~30 km)."
    }
  },
  {
    name: "Hornbill Festival Grounds",
    details: {
      description: "Kisama Heritage Village hosts Nagaland's famous 10-day Hornbill Festival each December, bringing together all major Naga tribes to showcase traditional dance, music, crafts, food, and games. Outside festival dates, the heritage village itself remains a cultural site to visit.",
      timings: "Festival runs annually December 1-10, approximately 9:00 AM to 5:00 PM with evening cultural programs. The heritage village grounds are accessible at other times of year too.",
      entryFee: "During the festival: approx. ₹20-100 per person per day (varies by source/year), plus a separate camera fee (~₹50). Indian visitors from outside Nagaland need an Inner Line Permit; foreign nationals should check current registration requirements.",
      bestTime: "First 10 days of December (festival dates)",
      famousFood: "Naga cuisine served at festival food stalls - smoked pork, Axone, Naga king chili dishes, rice beer (Zutho)",
      nearby: "Kohima (~12 km), Kohima War Cemetery, Naga Heritage Village morungs",
      transport: "Nearest airport: Dimapur Airport (~74 km, then approx. 1.5-2 hours by road to Kisama via Kohima)."
    }
  },
  {
    name: "Japfu Peak",
    details: {
      description: "The second-highest peak in Nagaland at around 3,048 metres, near Kohima, known for a moderately challenging trek, panoramic views, and the world's tallest rhododendron tree recorded near its slopes.",
      timings: "Trek typically starts early morning; the trek to the summit and back can take a full day or an overnight camp.",
      entryFee: "Nominal trekking fee (typically ₹50-100); Inner Line Permit required for Indian visitors from outside Nagaland.",
      bestTime: "October to April (clearer skies for views); rhododendrons bloom around March-April",
      famousFood: "Naga cuisine, basic trekking supplies from Kigwema village (common base)",
      nearby: "Kigwema village, Dzukou Valley (nearby trekking route), Kohima",
      transport: "Nearest airport: Dimapur Airport (~85 km). Base village reached by road from Kohima (~15 km)."
    }
  },
  {
    name: "Khonoma Village",
    details: {
      description: "India's first 'Green Village', an Angami Naga settlement renowned for pioneering community-led conservation, giving up hunting to protect the endangered Blyth's Tragopan pheasant. Known for terraced agriculture and a rich history of resistance during British colonial rule.",
      timings: "Open all day; guided village walks typically arranged through local homestays, roughly 9:00 AM to 5:00 PM.",
      entryFee: "Free to visit the village (guided nature walks/homestay experiences charged separately, typically ₹200-500).",
      bestTime: "October to April",
      famousFood: "Naga cuisine, Angami-style smoked meats, locally grown organic produce",
      nearby: "Khonoma Nature Conservation and Tragopan Sanctuary, Kohima (~20 km), Dzukou Valley",
      transport: "Nearest airport: Dimapur Airport (~90 km). Reached by road from Kohima (~20 km)."
    }
  },

  // BATCH 19: Odisha (all 6 places)
  {
    name: "Konark Sun Temple",
    details: {
      description: "A UNESCO World Heritage Site built in the 13th century by King Narasimhadeva I, designed as a colossal stone chariot with 24 carved wheels and 7 horses, dedicated to the Sun God. Known for its intricate carvings and precise astronomical alignment.",
      timings: "6:00 AM to 8:00 PM daily. Light and sound show held in the evening, around 7:00 PM (approx. 40 minutes, two sessions nightly).",
      entryFee: "Indian nationals: ₹40. SAARC/BIMSTEC nationals: ₹40. Foreign nationals: ₹600. Light and sound show ticketed separately (approx. ₹30).",
      bestTime: "October to February",
      famousFood: "Odia thali, Chhena Poda (local sweet), fresh seafood from nearby Chandrabhaga Beach",
      nearby: "Chandrabhaga Beach (~3 km), Konark Museum, Ramachandi Temple",
      transport: "Nearest airport: Biju Patnaik International Airport, Bhubaneswar (~65 km). Nearest railway station: Puri Railway Station (~35 km) or Bhubaneswar Railway Station (~65 km)."
    }
  },
  {
    name: "Jagannath Temple",
    details: {
      description: "One of the Char Dham (four sacred pilgrimage sites) of Hinduism, dedicated to Lord Jagannath along with his siblings Balabhadra and Subhadra. Famous worldwide for the annual Rath Yatra chariot festival. Entry to the main temple is restricted to Hindus only.",
      timings: "Approximately 5:00 AM to 12:00 AM, with specific ritual schedules throughout the day (a new queue system, 'Dhadi Darshan', was introduced in January 2026 to streamline entry).",
      entryFee: "Free general darshan, no entry ticket required. Note: entry to the main temple complex is restricted to Hindus only - this is strictly enforced at all four gates, with no exceptions for foreign visitors or non-Hindus. Non-Hindus can view the temple's tower from the nearby Raghunandan Library rooftop. During the Rath Yatra festival, non-Hindus can view the deities on the chariots in the street.",
      bestTime: "October to February (outside Rath Yatra crowds); during Rath Yatra (June/July) for the famous festival itself",
      famousFood: "Mahaprasad (temple's famous communal meal), Odia thali, Puri's local sweets",
      nearby: "Puri Beach, Gundicha Temple, Raghunandan Library viewpoint",
      transport: "Nearest airport: Biju Patnaik International Airport, Bhubaneswar (~60 km). Nearest railway station: Puri Railway Station (~2 km)."
    }
  },
  {
    name: "Chilika Lake",
    details: {
      description: "Asia's largest brackish water lagoon and a Ramsar wetland site, famous for hosting migratory birds, Irrawaddy dolphins near Satapada, and a rich fishing-based local economy spanning three districts.",
      timings: "Boat tours typically run 7:00 AM to 4:00 PM daily.",
      entryFee: "No general entry fee; boat rides for dolphin-watching or bird-watching cost approx. ₹500-1,500 per person depending on the route and group size.",
      bestTime: "November to February (migratory birds and calmer waters)",
      famousFood: "Odia thali, fresh Chilika lake crab and prawn dishes",
      nearby: "Satapada (dolphin point), Nalabana Bird Sanctuary, Rambha",
      transport: "Nearest airport: Biju Patnaik International Airport, Bhubaneswar (~100 km to Satapada). Nearest railway station: Balugaon or Puri, depending on access point."
    }
  },
  {
    name: "Udayagiri & Khandagiri Caves",
    details: {
      description: "A set of rock-cut caves carved in the 2nd-1st century BCE, primarily as residences for Jain monks under King Kharavela. Known for detailed carvings and inscriptions documenting ancient Odishan history.",
      timings: "Approximately 8:00 AM to 6:00 PM daily.",
      entryFee: "Indian nationals: approx. ₹25. Foreign nationals: approx. ₹300.",
      bestTime: "October to March",
      famousFood: "Odia thali, Bhubaneswar street food, Chhena Poda",
      nearby: "Dhauli Peace Pagoda, Bhubaneswar temple complex (Lingaraj Temple), Odisha State Museum",
      transport: "Nearest airport: Biju Patnaik International Airport, Bhubaneswar (~8 km). Nearest railway station: Bhubaneswar Railway Station (~7 km)."
    }
  },
  {
    name: "Simlipal National Park",
    details: {
      description: "A UNESCO Biosphere Reserve and tiger reserve in Mayurbhanj district, known for waterfalls, dense sal forests, and rich biodiversity including tigers, elephants, and the rare melanistic (black) tiger occasionally sighted here.",
      timings: "Park generally open November to mid-June (closed during monsoon). Safaris typically run in morning and afternoon slots.",
      entryFee: "Entry and safari permit together typically range from approx. ₹1,000-2,500 per vehicle depending on zone and vehicle type, plus a guide fee - confirm current rates before visiting as they change periodically.",
      bestTime: "November to April",
      famousFood: "Odia thali, tribal Mayurbhanj-region cuisine, local forest-lodge meals",
      nearby: "Barehipani Falls, Joranda Falls, Mayurbhanj town",
      transport: "Nearest airport: Biju Patnaik International Airport, Bhubaneswar (~250 km). Nearest railway station: Baripada (~20 km from the park gate)."
    }
  },
  {
    name: "Lingaraj Temple",
    details: {
      description: "One of the oldest and largest temples in Bhubaneswar, dedicated to Lord Shiva (worshipped here as Harihara, a combined form of Shiva and Vishnu), dating back to the 11th century and showcasing classic Kalinga architecture.",
      timings: "Approximately 5:00 AM to 9:00 PM daily.",
      entryFee: "Free general darshan. Note: entry to the inner temple is restricted to Hindus; non-Hindu visitors can view the temple from a platform built for this purpose (arranged for Lord Curzon's visit historically).",
      bestTime: "October to March",
      famousFood: "Odia thali, Chhena Poda, Bhubaneswar street food",
      nearby: "Udayagiri & Khandagiri Caves, Mukteshwar Temple, Bindusagar Lake",
      transport: "Nearest airport: Biju Patnaik International Airport, Bhubaneswar (~7 km). Nearest railway station: Bhubaneswar Railway Station (~5 km)."
    }
  },

  // BATCH 20: Sikkim (all 5 places)
  {
    name: "Tsomgo Lake",
    details: {
      description: "Also known as Changu Lake, a sacred glacial lake at about 12,400 feet, considered holy by local Sikkimese people. Surrounded by snow-capped mountains and often frozen in winter, it's a popular stop en route to Nathula Pass.",
      timings: "Approximately 8:00 AM to 4:00 PM daily (weather-dependent; closed during heavy snowfall).",
      entryFee: "Permit required for Indian visitors (arranged through registered tour operators in Gangtok, typically bundled with the Nathula Pass permit); nominal separate entry fee may apply. Yak rides and other activities charged extra.",
      bestTime: "May to October (accessible road conditions); frozen and scenic in winter but access can be restricted",
      famousFood: "Sikkimese momos and thukpa, hot tea and Maggi at lakeside stalls",
      nearby: "Nathula Pass, Baba Harbhajan Singh Temple, Kyongnosla Alpine Sanctuary",
      transport: "Nearest airport: Pakyong Airport, Sikkim (~65 km) or Bagdogra Airport, West Bengal (~120 km). Reached by road from Gangtok (~40 km)."
    }
  },
  {
    name: "Nathula Pass",
    details: {
      description: "A high-altitude Himalayan mountain pass at 14,140 feet on the India-China border, a historic offshoot of the ancient Silk Route, and site of the Indo-Tibetan trade mart. One of the few open border points between India and China.",
      timings: "8:00 AM to 3:00 PM, closed on Mondays and Tuesdays. Closed entirely during heavy winter snowfall.",
      entryFee: "Mandatory entry permit: approx. ₹200 per person, arranged in advance through a registered Sikkim tour operator (only Indian citizens permitted with a valid photo ID and passport-size photos; foreign nationals are not allowed at Nathula Pass itself). Photography is prohibited at the border area.",
      bestTime: "May to October",
      famousFood: "Sikkimese momos and thukpa, hot tea at roadside stalls near the pass",
      nearby: "Tsomgo Lake, Baba Harbhajan Singh Temple, Watershed War Memorial",
      transport: "Nearest airport: Pakyong Airport, Sikkim (~70 km). Reached by road from Gangtok (~54-56 km, only via authorized tour vehicles)."
    }
  },
  {
    name: "Rumtek Monastery",
    details: {
      description: "One of the largest and most significant monasteries in Sikkim, seat of the Karma Kagyu lineage of Tibetan Buddhism, rebuilt in the 1960s following the original Tibetan design. Houses precious religious artifacts and a golden stupa.",
      timings: "Approximately 6:00 AM to 6:00 PM daily.",
      entryFee: "Free entry (donations welcome). Note: personal identification may be checked at the entrance for security.",
      bestTime: "March to June, and September to November",
      famousFood: "Sikkimese momos, thukpa, butter tea served at nearby monastery cafes",
      nearby: "Gangtok city, Institute of Tibetology, Ranka Monastery",
      transport: "Nearest airport: Pakyong Airport, Sikkim (~45 km). Reached by road from Gangtok (~24 km)."
    }
  },
  {
    name: "Yumthang Valley",
    details: {
      description: "Known as the 'Valley of Flowers' of Sikkim, a high-altitude valley famous for rhododendron blooms in spring, hot springs, and dramatic Himalayan scenery near the Tibet border in North Sikkim.",
      timings: "Approximately 8:00 AM to 4:00 PM daily (weather-dependent, and only accessible with a Protected Area Permit).",
      entryFee: "Protected Area Permit required for both Indian and foreign visitors, arranged through registered tour operators in Gangtok (typically bundled into North Sikkim tour packages, no separate fee usually needed beyond the permit and tour cost).",
      bestTime: "March to June (peak rhododendron bloom); pleasant year-round otherwise, weather permitting",
      famousFood: "Sikkimese momos and thukpa, hot tea and Maggi at valley stalls",
      nearby: "Lachung village, Zero Point, Yumthang hot springs",
      transport: "Nearest airport: Pakyong Airport, Sikkim (~150 km). Reached by road from Gangtok via Lachung (~150 km, 2-day tour typical)."
    }
  },
  {
    name: "Pelling",
    details: {
      description: "A small town in West Sikkim offering some of the best views of Mount Kanchenjunga, the world's third-highest peak, along with nearby monasteries, waterfalls, and the historic ruins of Rabdentse, Sikkim's former capital.",
      timings: "Open all day; individual attractions (Rabdentse Ruins, Pemayangtse Monastery) typically 8:00 AM to 5:00 PM.",
      entryFee: "Free to explore the town; individual attractions have nominal entry fees (typically under ₹50).",
      bestTime: "March to June, and September to November (clearest Kanchenjunga views)",
      famousFood: "Sikkimese momos and thukpa, Sael Roti (local rice bread), Chhurpi (local cheese)",
      nearby: "Pemayangtse Monastery, Rabdentse Ruins, Kanchenjunga Falls",
      transport: "Nearest airport: Pakyong Airport, Sikkim (~110 km) or Bagdogra Airport, West Bengal (~135 km). Nearest railway station: New Jalpaiguri, West Bengal (~150 km)."
    }
  },

  // BATCH 21: Finishing Punjab (4 remaining places) + Rajasthan (10 remaining places)
  {
    name: "Jallianwala Bagh",
    details: {
      description: "A historic public garden and national memorial marking the site of the 1919 Jallianwala Bagh Massacre, where British troops fired on unarmed civilians. Preserved bullet marks and a martyrs' well remain as solemn reminders of the tragedy.",
      timings: "Approximately 6:00-6:30 AM to 7:00-7:30 PM daily (varies slightly by season). Martyrs' Gallery/museum: 9:00 AM-5:00 PM (summer), 10:00 AM-4:00 PM (winter). Evening light and sound show around 7:00-8:00 PM.",
      entryFee: "Free entry to the garden and memorial. Light and sound show ticketed separately (approx. ₹50).",
      bestTime: "October to March",
      famousFood: "Amritsari Kulcha, Chhole, Poori-Aloo",
      nearby: "Golden Temple (5-minute walk), Partition Museum, Wagah Border (day-trip)",
      transport: "Nearest airport: Sri Guru Ram Dass Jee International Airport (~11 km). Nearest railway station: Amritsar Junction (~2 km)."
    }
  },
  {
    name: "Wagah Border",
    details: {
      description: "The India-Pakistan border crossing near Attari, famous for its daily Beating Retreat ceremony - a highly choreographed display of military showmanship, flag lowering, and patriotic celebration performed by India's BSF and Pakistan Rangers since 1959.",
      timings: "Border/entry gates open approximately 10:00 AM to 4:00-6:00 PM. The ceremony itself starts around 4:15 PM in winter and 5:15 PM in summer (arrive 1-2 hours early for good seating).",
      entryFee: "Free entry (first-come, first-served general seating). Foreign passport holders get a separate seating section - carry your physical passport.",
      bestTime: "October to March",
      famousFood: "Punjabi street food and snack stalls near the parking area, Amritsari Kulcha back in the city",
      nearby: "Attari village, Golden Temple (~28-30 km), Jallianwala Bagh",
      transport: "Nearest airport: Sri Guru Ram Dass Jee International Airport, Amritsar (~35 km). Reached by road from Amritsar (~28-30 km, 45-75 minutes)."
    }
  },
  {
    name: "Anandpur Sahib",
    details: {
      description: "A major Sikh pilgrimage city founded in 1665, where Guru Gobind Singh established the Khalsa Panth in 1699. Home to several important gurdwaras, including Kesgarh Sahib, and hosts the vibrant annual Hola Mohalla festival.",
      timings: "Approximately 4:00 AM to 10:00 PM daily (gurdwara hours; may vary slightly by shrine).",
      entryFee: "Free entry (donations welcome; community meals/langar also free).",
      bestTime: "October to March; Hola Mohalla festival (around March, coinciding with Holi) for a major cultural experience",
      famousFood: "Langar (free community meal), Punjabi thali, Makki di Roti with Sarson da Saag",
      nearby: "Takht Sri Kesgarh Sahib, Virasat-e-Khalsa Museum, Anandgarh Fort",
      transport: "Nearest airport: Chandigarh Airport (~85 km). Nearest railway station: Anandpur Sahib Railway Station."
    }
  },
  {
    name: "Qila Mubarak",
    details: {
      description: "A historic fort in Patiala, once the seat of the Patiala royal family, built in stages from the 18th century onward. Blends Rajput, Mughal, and local architectural styles, and now serves as a heritage and cultural site.",
      timings: "Approximately 9:30 AM to 5:00 PM, closed Mondays (subject to renovation-related closures - confirm locally as parts have periodically undergone restoration).",
      entryFee: "Nominal entry fee (typically under ₹50 for Indian visitors).",
      bestTime: "October to March",
      famousFood: "Punjabi thali, Patiala's famous Patiala Peg (a large whisky measure, more cultural reference than food), Amritsari-style snacks",
      nearby: "Sheesh Mahal, Baradari Gardens, Moti Bagh Palace",
      transport: "Nearest airport: Chandigarh Airport (~65 km). Nearest railway station: Patiala Railway Station (~3 km)."
    }
  },
  {
    name: "Lake Pichola",
    details: {
      description: "A picturesque artificial lake in Udaipur created in 1362, surrounded by palaces, temples, and ghats, including the iconic Lake Palace (Jag Niwas) that appears to float on its waters.",
      timings: "Boat rides typically run 10:00 AM to 6:00 PM (sunset boat rides are especially popular).",
      entryFee: "No general entry fee to view the lake; boat rides cost approx. ₹400-700 per person depending on route and duration (City Palace jetty departures).",
      bestTime: "September to March",
      famousFood: "Rajasthani thali, Dal Baati Churma, Udaipur's Mirchi Vada",
      nearby: "City Palace, Jag Mandir, Bagore Ki Haveli",
      transport: "Nearest airport: Maharana Pratap Airport, Udaipur (~22 km). Nearest railway station: Udaipur City Railway Station (~3 km)."
    }
  },
  {
    name: "Jaisalmer Fort",
    details: {
      description: "A UNESCO World Heritage Site and one of the few 'living forts' in the world, where about a quarter of the old city's population still resides inside its walls. Built in 1156 from golden-yellow sandstone, giving Jaisalmer its nickname 'the Golden City'.",
      timings: "Approximately 8:00 AM to 6:00 PM (fort area accessible; individual havelis and the palace museum have specific hours, roughly 9:00 AM-6:00 PM).",
      entryFee: "Free to walk through the fort's streets. Jaisalmer Fort Palace Museum: approx. ₹100-500 for Indians, higher for foreigners depending on ticket type.",
      bestTime: "October to March",
      famousFood: "Rajasthani thali, Ker Sangri, Dal Baati Churma, Jaisalmer's famous Kachori",
      nearby: "Patwon Ki Haveli, Gadisar Lake, Sam Sand Dunes (day-trip)",
      transport: "Nearest airport: Jaisalmer Airport (~17 km). Nearest railway station: Jaisalmer Railway Station (~2.5 km)."
    }
  },
  {
    name: "Amber Fort",
    details: {
      description: "A UNESCO World Heritage Site built in 1592 by Raja Man Singh I, blending Rajput and Mughal architecture on a hilltop overlooking Maota Lake. Famous for the Sheesh Mahal (Mirror Palace) and its dramatic courtyards.",
      timings: "8:00 AM to 5:30 PM daily (last entry around 5:00 PM). Evening light and sound show around 7:00-7:30 PM.",
      entryFee: "Note: Rajasthan revised monument fees from 1 January 2026 - current rates are approx. ₹100 for Indian visitors and ₹500 for foreign visitors (some older sources still show the pre-2026 rate of ₹200/₹1,000 - confirm at the counter). A composite ticket covering multiple Jaipur monuments is also available. Light and sound show ticketed separately (approx. ₹295).",
      bestTime: "October to March",
      famousFood: "Rajasthani thali, Dal Baati Churma, Jaipur's famous Pyaaz Kachori",
      nearby: "Jaigarh Fort, Nahargarh Fort, Maota Lake",
      transport: "Nearest airport: Jaipur International Airport (~24 km). Nearest railway station: Jaipur Junction (~11 km)."
    }
  },
  {
    name: "Pushkar Lake",
    details: {
      description: "One of the holiest lakes in Hinduism, believed to have been created by a lotus petal dropped by Lord Brahma. Surrounded by 52 bathing ghats and over 500 temples, including one of the few Brahma temples in the world.",
      timings: "Open all day; ghats most active during sunrise and sunset aarti (evening prayer ceremony).",
      entryFee: "Free entry (donations welcome; priests at the ghats may request a fee for a puja ceremony - agree on the amount beforehand to avoid overcharging).",
      bestTime: "October to March; Pushkar Camel Fair (around October-November) for a major cultural experience",
      famousFood: "Rajasthani thali (vegetarian-only town due to its sacred status), Malpua, Pushkar's famous street food",
      nearby: "Brahma Temple, Savitri Temple, Ajmer Sharif Dargah (day-trip, ~15 km)",
      transport: "Nearest airport: Kishangarh Airport (~35 km) or Jaipur International Airport (~145 km). Nearest railway station: Ajmer Junction (~15 km)."
    }
  },
  {
    name: "Hawa Mahal",
    details: {
      description: "Jaipur's iconic 'Palace of Winds', built in 1799 by Maharaja Sawai Pratap Singh with a five-story pink sandstone facade featuring 953 small windows (jharokhas). Designed so royal women could observe street life while remaining unseen.",
      timings: "9:00 AM to 5:00 PM daily. Best photographed from outside between 9:00-11:00 AM when morning light hits the facade.",
      entryFee: "Note: Rajasthan revised monument fees from 1 January 2026 - current rates are approx. ₹100 for Indian visitors and ₹600 for foreign visitors (some sources still show older ₹50/₹200 rates - confirm at the counter). Children up to 7 years typically enter free.",
      bestTime: "October to March",
      famousFood: "Rajasthani thali, Jaipur's famous Pyaaz Kachori and Ghewar",
      nearby: "City Palace, Jantar Mantar, Tripolia Bazaar",
      transport: "Nearest airport: Jaipur International Airport (~13 km). Nearest railway station: Jaipur Junction (~5 km)."
    }
  },
  {
    name: "City Palace",
    details: {
      description: "A grand palace complex in Udaipur built over nearly 400 years starting in 1559 by Maharana Udai Singh II, blending Rajasthani and Mughal architectural styles. Offers panoramic views over Lake Pichola and houses a museum of royal artifacts.",
      timings: "Approximately 9:30 AM to 5:30 PM daily.",
      entryFee: "Approx. ₹300-400 for Indian adults (museum entry), higher for foreign visitors; additional charges for the Crystal Gallery and other special sections.",
      bestTime: "September to March",
      famousFood: "Rajasthani thali, Dal Baati Churma, Udaipur's Mirchi Vada",
      nearby: "Lake Pichola, Jagdish Temple, Saheliyon Ki Bari",
      transport: "Nearest airport: Maharana Pratap Airport, Udaipur (~24 km). Nearest railway station: Udaipur City Railway Station (~3 km)."
    }
  },
  {
    name: "Thar Desert Safari",
    details: {
      description: "Jeep and camel safaris through the golden sand dunes surrounding Jaisalmer, especially around Sam and Khuri villages, offering sunset views, desert camping, and traditional Rajasthani cultural performances.",
      timings: "Camel/jeep safaris typically run in the late afternoon for sunset viewing, roughly 3:00 PM to 7:00 PM; overnight desert camps available.",
      entryFee: "Sam Sand Dunes entry: nominal fee (typically ₹50-100 per vehicle). Camel safari: approx. ₹300-800 per person depending on duration. Overnight desert camp packages (with dinner and cultural show): approx. ₹1,500-4,000+ per person.",
      bestTime: "October to February",
      famousFood: "Rajasthani thali, Ker Sangri, Bajre ki Roti, desert camp barbecue dinners with folk music",
      nearby: "Sam Sand Dunes, Khuri village, Jaisalmer Fort",
      transport: "Nearest airport: Jaisalmer Airport (~40 km from Sam Dunes). Sam Sand Dunes are about 40-45 km from Jaisalmer city by road."
    }
  },
  {
    name: "Ranthambore National Park",
    details: {
      description: "One of India's premier tiger reserves, set around the ruins of the 10th-century Ranthambore Fort, known for offering some of the best chances in India to see wild tigers, alongside leopards, crocodiles, and diverse birdlife.",
      timings: "Safaris run in two daily slots, morning (roughly 6:00-10:00 AM) and afternoon (roughly 2:30-6:30 PM), timing shifts seasonally. Park closed 1 July to 30 September (monsoon).",
      entryFee: "Safari costs vary by vehicle type: canter (shared, 20-seater) approx. ₹1,000-1,500 per person; gypsy (6-seater, jeep) approx. ₹4,000-6,000 per vehicle - prices include entry, vehicle, and guide fees. Advance online booking strongly recommended as slots fill quickly.",
      bestTime: "October to April (April-June sometimes better for tiger sightings due to sparse vegetation, but very hot)",
      famousFood: "Rajasthani thali, Dal Baati Churma, forest-lodge meals near Sawai Madhopur",
      nearby: "Ranthambore Fort, Trinetra Ganesh Temple, Surwal Lake",
      transport: "Nearest airport: Jaipur International Airport (~180 km). Nearest railway station: Sawai Madhopur Railway Station (~11 km)."
    }
  },
  {
    name: "Chittorgarh Fort",
    details: {
      description: "One of the largest forts in India and a UNESCO World Heritage Site, symbolizing Rajput valor and sacrifice through its history of sieges and the legendary acts of jauhar (self-immolation) by its queens rather than face capture.",
      timings: "Approximately 9:45 AM to 6:15 PM daily. Light and sound show held in the evening (seasonal timing).",
      entryFee: "Indian nationals: approx. ₹40-50. Foreign nationals: approx. ₹300-600. Light and sound show ticketed separately.",
      bestTime: "October to March",
      famousFood: "Rajasthani thali, Dal Baati Churma, local Mewar-region cuisine",
      nearby: "Vijay Stambha (Tower of Victory), Rani Padmini's Palace, Kirti Stambha",
      transport: "Nearest airport: Maharana Pratap Airport, Udaipur (~90 km). Nearest railway station: Chittorgarh Railway Station (~4 km)."
    }
  },
  {
    name: "Nahargarh Fort",
    details: {
      description: "A hilltop fort overlooking Jaipur, built in 1734 as part of the city's defense ring alongside Amber and Jaigarh forts. Popular for sunset views over the Pink City and its distinctive Madhavendra Bhawan palace with symmetrical apartments.",
      timings: "Approximately 10:00 AM to 5:30 PM daily (some sources note extended evening hours for the viewpoint/restaurant area).",
      entryFee: "Nominal entry fee (typically ₹50-200 for Indian visitors, higher for foreign visitors - confirm current 2026 rate at the counter given Rajasthan's recent fee revisions).",
      bestTime: "October to March",
      famousFood: "Rajasthani thali available at the on-site restaurant with panoramic city views, Jaipur's Pyaaz Kachori",
      nearby: "Jaigarh Fort, Amber Fort, Jaipur city viewpoints",
      transport: "Nearest airport: Jaipur International Airport (~20 km). Nearest railway station: Jaipur Junction (~11 km)."
    }
  },
  {
    name: "Meenakshi Temple",
    details: {
      description: "A historic temple dedicated to Goddess Meenakshi (a form of Parvati) and her consort Sundareswarar (Shiva), famous for its 14 towering, intricately carved gopurams (gateway towers) and the Hall of a Thousand Pillars.",
      timings: "Approximately 5:00 AM to 12:30 PM, then 4:00 PM to 9:30-10:00 PM daily (closes midday for a break).",
      entryFee: "Free general darshan. Special/faster darshan tickets available: approx. ₹50 for one shrine, ₹100 for both. Art Museum entry: approx. ₹5 for Indians, ₹50 for foreigners.",
      bestTime: "October to March",
      famousFood: "Tamil Nadu thali, Madurai's famous Jigarthanda (cold dessert drink), Kari Dosa",
      nearby: "Thirumalai Nayakkar Mahal, Vandiyur Mariamman Teppakulam, Gandhi Memorial Museum",
      transport: "Nearest airport: Madurai Airport (~12 km). Nearest railway station: Madurai Junction (~2 km)."
    }
  },
  {
    name: "Ooty Hills",
    details: {
      description: "A hill station in the Nilgiri Mountains, known as the 'Queen of Hill Stations', famous for tea gardens, botanical gardens, Ooty Lake, and the UNESCO-listed Nilgiri Mountain Railway toy train.",
      timings: "Open all day; individual attractions like the Botanical Garden and boathouse typically 7:00 AM/8:00 AM to 6:00 PM.",
      entryFee: "Free to explore the town; Botanical Garden entry approx. ₹30-50, boating at Ooty Lake approx. ₹100-300.",
      bestTime: "October to June (avoid heaviest monsoon months)",
      famousFood: "Ooty homemade chocolates, Nilgiri tea, South Indian thali",
      nearby: "Doddabetta Peak, Ooty Lake, Botanical Garden",
      transport: "Nearest airport: Coimbatore Airport (~90 km). Nearest railway station: Ooty (Udhagamandalam) Railway Station, connected via the Nilgiri Mountain Railway from Mettupalayam."
    }
  },
  {
    name: "Shore Temple",
    details: {
      description: "A UNESCO World Heritage Site built in the 8th century by the Pallava dynasty, one of the oldest structural stone temples in South India, dedicated to Lord Shiva, standing dramatically at the edge of the Bay of Bengal.",
      timings: "Approximately 6:00 AM to 6:00 PM daily.",
      entryFee: "Indian nationals: approx. ₹40. Foreign nationals: approx. ₹600. Children under 15: free.",
      bestTime: "November to February",
      famousFood: "Tamil Nadu coastal seafood, South Indian thali, Mahabalipuram's famous fresh fish fry",
      nearby: "Five Rathas (Pancha Rathas), Arjuna's Penance, Mahabalipuram Beach",
      transport: "Nearest airport: Chennai International Airport (~55 km). Nearest railway station: Chengalpattu (~29 km)."
    }
  },
  {
    name: "Kodaikanal",
    details: {
      description: "A hill station in the Palani Hills known as the 'Princess of Hill Stations', famous for Kodaikanal Lake (a star-shaped artificial lake), pine forests, and cool climate, popular for boating and scenic viewpoints.",
      timings: "Open all day; Kodaikanal Lake boating typically 9:00 AM to 5:30 PM.",
      entryFee: "Free to explore the town; boating at the lake approx. ₹100-300, individual viewpoints/gardens have nominal fees.",
      bestTime: "September to May",
      famousFood: "Kodaikanal homemade chocolates and plum cakes, South Indian thali, fresh Nilgiri-region produce",
      nearby: "Coaker's Walk, Bryant Park, Pillar Rocks",
      transport: "Nearest airport: Madurai Airport (~120 km). Nearest railway station: Kodai Road Railway Station (~80 km)."
    }
  },
  {
    name: "Brihadeeswarar Temple",
    details: {
      description: "A UNESCO World Heritage Site built in 1010 CE by Raja Raja Chola I, a masterpiece of Chola-era Dravidian architecture, famous for its massive vimana (tower) topped by a single 80-tonne granite block.",
      timings: "Approximately 6:00 AM to 12:30 PM, then 4:00 PM to 8:30 PM daily.",
      entryFee: "Free general entry (ASI ticket may apply for certain areas, typically nominal for Indians).",
      bestTime: "October to March",
      famousFood: "Tamil Nadu thali, Thanjavur's traditional South Indian sweets, filter coffee",
      nearby: "Thanjavur Palace, Saraswathi Mahal Library, Thanjavur Art Gallery",
      transport: "Nearest airport: Tiruchirappalli (Trichy) Airport (~60 km). Nearest railway station: Thanjavur Junction (~3 km)."
    }
  },
  {
    name: "Marina Beach",
    details: {
      description: "One of the longest urban beaches in the world at about 13 km, stretching along Chennai's coastline. A popular spot for evening walks, street food, and gatherings, lined with statues and monuments.",
      timings: "Open 24 hours; most lively in the early morning and evening (swimming is discouraged due to strong currents).",
      entryFee: "Free entry.",
      bestTime: "November to February",
      famousFood: "Chennai street food (sundal, bhel puri, sugarcane juice), South Indian filter coffee",
      nearby: "Kapaleeshwarar Temple, Fort St. George, Vivekananda House",
      transport: "Nearest airport: Chennai International Airport (~20 km). Nearest railway station: Chennai Central (~4 km)."
    }
  },
  {
    name: "Kanyakumari",
    details: {
      description: "The southernmost tip of mainland India, where the Arabian Sea, Bay of Bengal, and Indian Ocean meet. Famous for sunrise and sunset views, the Vivekananda Rock Memorial, and the towering Thiruvalluvar Statue.",
      timings: "Open all day; Vivekananda Rock Memorial ferry service typically runs 8:00 AM to 4:00 PM.",
      entryFee: "Free to visit the shoreline. Vivekananda Rock Memorial: ferry ticket approx. ₹50-100 plus a small memorial entry fee.",
      bestTime: "October to March",
      famousFood: "Tamil Nadu coastal seafood, South Indian thali, fresh coconut water",
      nearby: "Vivekananda Rock Memorial, Thiruvalluvar Statue, Kanyakumari Beach",
      transport: "Nearest airport: Thiruvananthapuram International Airport, Kerala (~85 km). Nearest railway station: Kanyakumari Railway Station (~1 km)."
    }
  }

];

// Connect and run the updates
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected. Updating places...");

    for (const item of updates) {
      const result = await Place.updateOne(
        { name: item.name },
        { $set: item.details }
      );
      console.log(item.name, "- matched:", result.matchedCount, "modified:", result.modifiedCount);
    }

    console.log("Batch update complete.");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log("Error:", error);
  });