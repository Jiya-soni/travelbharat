// This script UPDATES existing places by name - it does NOT delete
// or duplicate anything. Safe to run again later with new batches.

const mongoose = require("mongoose");
require("dotenv").config();
const Place = require("./models/Place");

// BATCH 1: Andhra Pradesh (all 6 places)
const updates = [
  {
    name: "Araku Valley",
    details: {
      description: "A scenic hill station in the Eastern Ghats, known for coffee plantations, tribal culture, waterfalls, and a scenic train route from Visakhapatnam.",
      timings: "Open all day (best visited during daylight hours)",
      entryFee: "Free (individual attractions like caves/waterfalls may charge separately)",
      bestTime: "October to March",
      famousFood: "Araku Coffee, Bamboo Chicken (Bongulo Chicken)",
      nearby: "Borra Caves, Katiki Waterfalls, Tribal Museum",
      transport: "Nearest airport: Visakhapatnam Airport (~110 km). Scenic train available from Visakhapatnam Railway Station."
    }
  },
  {
    name: "Tirupati Balaji Temple",
    details: {
      description: "One of the world's most visited religious sites, dedicated to Lord Venkateswara (a form of Vishnu). Located on the Tirumala hills, it draws tens of millions of pilgrims every year.",
      timings: "The temple stays open nearly 22-23 hours a day (roughly 2:30 AM to 1:00 AM), with brief closures for rituals. Free 'Sarva Darshan' runs most of the day; paid 'Special Entry Darshan' (₹300) runs in slots, commonly around 9:00 AM - 5:00 PM.",
      entryFee: "Free general darshan (Sarva Darshan). Special Entry Darshan ticket: ₹300 for faster access.",
      bestTime: "September to February",
      famousFood: "Tirupati Laddu (temple prasadam), traditional Andhra thali",
      nearby: "Sri Venkateswara Zoological Park, Akasa Ganga waterfall, Sri Padmavathi Temple (Tiruchanur)",
      transport: "Nearest airport: Tirupati Airport (~15 km). Nearest railway station: Tirupati Railway Station (~22 km from the hill temple)."
    }
  },
  {
    name: "Borra Caves",
    details: {
      description: "One of India's largest and deepest limestone cave systems, formed over a million years by the Gosthani River. Famous for dramatic stalactite and stalagmite formations, some resembling recognizable shapes.",
      timings: "10:00 AM to 5:00 PM daily (ticket counter typically closes 12:00-1:00 PM for an hour).",
      entryFee: "Approx. ₹40-60 for adults, ₹30-45 for children (varies by source; camera/video fees may apply separately).",
      bestTime: "October to March",
      famousFood: "Araku Coffee, local bamboo-cooked dishes available nearby",
      nearby: "Araku Valley, Katiki Waterfalls, Tribal Museum",
      transport: "Nearest airport: Visakhapatnam Airport (~90 km). The Visakhapatnam-Araku train has a stop near Borra Caves."
    }
  },
  {
    name: "Visakhapatnam Beach",
    details: {
      description: "Also known as RK Beach, a popular urban beach along Visakhapatnam's coastline, lined with promenades, a submarine museum, and views of the Bay of Bengal.",
      timings: "Open 24 hours, though most visited in the early morning and evening.",
      entryFee: "Free (Submarine Museum nearby charges a separate small entry fee).",
      bestTime: "November to February",
      famousFood: "Fresh seafood, Andhra-style fish curry, street snacks along the beach road",
      nearby: "Kailasagiri Hill Park, INS Kurusura Submarine Museum, Rushikonda Beach",
      transport: "Nearest airport: Visakhapatnam Airport (~15 km). Nearest railway station: Visakhapatnam Railway Station (~6 km)."
    }
  },
  {
    name: "Lepakshi Temple",
    details: {
      description: "A 16th-century Vijayanagara-era temple dedicated to Lord Veerabhadra, famous for its hanging pillar, a giant monolithic Nandi statue, and intricately painted ceilings.",
      timings: "Roughly 6:00 AM to 6:00 PM daily (best visited in daylight).",
      entryFee: "Free entry (donations welcome; hiring a local guide typically costs ₹200-400).",
      bestTime: "October to March",
      famousFood: "Local Andhra thali, Anantapur groundnut sweets",
      nearby: "Nandi Hills, Hindupur, Puttaparthi (Sri Sathya Sai Baba's ashram)",
      transport: "Nearest major airport: Kempegowda International Airport, Bengaluru (~120 km). Nearest railway station: Hindupur (~12 km)."
    }
  },
  {
    name: "Undavalli Caves",
    details: {
      description: "A set of rock-cut cave temples carved into a sandstone hillside, dating back to the 4th-5th century. Notable for a large reclining Vishnu statue and Buddhist-influenced architecture later adapted for Hindu worship.",
      timings: "Approx. 9:00 AM to 5:00 PM daily.",
      entryFee: "Nominal entry fee (typically under ₹25 for Indian visitors; check locally as it may change).",
      bestTime: "October to March",
      famousFood: "Vijayawada-style Andhra meals, Guntur chili-based dishes nearby",
      nearby: "Prakasam Barrage, Kanaka Durga Temple (Vijayawada), Amaravati",
      transport: "Nearest airport: Vijayawada Airport (~25 km). Nearest railway station: Vijayawada Junction (~7 km)."
    }
  },

  // BATCH 2: Arunachal Pradesh (all 5 places)
  {
    name: "Tawang Monastery",
    details: {
      description: "The largest monastery in India and one of the largest in the world, founded in 1680-81 and belonging to the Gelug school of Tibetan Buddhism. Perched at around 10,000 feet, it overlooks the Tawang valley and houses over 300 monks.",
      timings: "Approximately 7:00 AM to 7:00 PM daily (main prayer hall may pause briefly during active prayers).",
      entryFee: "Free (donations welcome). Note: Arunachal Pradesh requires an Inner Line Permit (ILP) for Indian visitors, and a Protected Area Permit for foreign nationals, to enter the state.",
      bestTime: "March to October (clearer weather; winters are extremely cold)",
      famousFood: "Thukpa, momos, Zan (local buckwheat porridge)",
      nearby: "Sela Pass, Madhuri Lake (Shungetser Lake), Bum La Pass",
      transport: "Nearest airport and railway station: both in Tezpur, Assam (well outside Tawang - road travel required)."
    }
  },
  {
    name: "Ziro Valley",
    details: {
      description: "A picturesque valley in the Lower Subansiri district, home to the Apatani tribe, known for rice-cum-fish cultivation, pine-covered hills, and hosting the annual Ziro Music Festival.",
      timings: "Open all day; best explored during daylight for village and valley visits.",
      entryFee: "Free to enter the valley (Inner Line Permit required for Indian visitors to enter Arunachal Pradesh).",
      bestTime: "March to October",
      famousFood: "Apong (local rice beer), bamboo shoot dishes, Apatani-style smoked meat",
      nearby: "Talley Valley Wildlife Sanctuary, Apatani villages (Hong, Hija), Kile Pakho viewpoint",
      transport: "Nearest airport: Naharlagun Helipad or Lilabari Airport, Assam (~115 km). Nearest railway station: Naharlagun (~115 km)."
    }
  },
  {
    name: "Sela Pass",
    details: {
      description: "A high-altitude mountain pass at about 13,700 feet connecting Tawang with the rest of Arunachal Pradesh, known for dramatic views, a sacred lake, and snow for much of the year.",
      timings: "Open during daylight hours; can close temporarily after heavy snowfall.",
      entryFee: "Free (Inner Line Permit required for the region).",
      bestTime: "March to June, and September to October",
      famousFood: "Hot butter tea, thukpa (popular at roadside stalls near the pass)",
      nearby: "Sela Lake, Jaswant Garh War Memorial, Tawang Monastery",
      transport: "Accessible by road from Tawang or Dirang; no airport or rail station nearby, best reached by private vehicle."
    }
  },
  {
    name: "Bomdila Monastery",
    details: {
      description: "A Tibetan Buddhist monastery in Bomdila town, built in the style of the Tsona Gontse monastery in Tibet, offering panoramic views of the Himalayan ranges.",
      timings: "Approximately 8:00 AM to 6:00 PM daily.",
      entryFee: "Free (donations welcome; Inner Line Permit required for the region).",
      bestTime: "March to June, and October to November",
      famousFood: "Thukpa, momos, local Monpa-style dishes",
      nearby: "Bomdila View Point, Apple orchards, Eaglenest Wildlife Sanctuary",
      transport: "Nearest airport: Tezpur Airport, Assam (~160 km). Nearest railway station: Rangapara, Assam (~160 km)."
    }
  },
  {
    name: "Namdapha National Park",
    details: {
      description: "India's third-largest national park and a tiger reserve, spanning a huge range of elevations from tropical rainforest to alpine terrain. Home to rare species including the red panda, snow leopard, and clouded leopard.",
      timings: "Roughly 6:00 AM to 5:00 PM for entry (specific trekking/safari zones regulated separately by the Forest Department).",
      entryFee: "Approx. ₹50-100 for Indian nationals, higher for foreign nationals; camera fees may apply separately. Permits required from the Forest Department at Miao.",
      bestTime: "October to April (monsoon season makes access difficult)",
      famousFood: "Local Arunachali tribal cuisine available in Miao town; limited food options inside the park itself",
      nearby: "Miao, Deban Campsite, Lake of No Return",
      transport: "Nearest airport: Dibrugarh Airport, Assam (~182 km). Nearest railway station: Tinsukia, Assam (~140 km). Accessible via Miao town by road."
    }
  },

  // BATCH 3: Assam (all 6 places)
  {
    name: "Kaziranga National Park",
    details: {
      description: "A UNESCO World Heritage Site on the floodplains of the Brahmaputra River, famous for hosting about two-thirds of the world's one-horned rhinoceros population, along with tigers, elephants, and wild water buffalo.",
      timings: "Jeep safaris typically run in two slots: approx. 7:30-9:30 AM and 1:30-4:30 PM. Elephant safaris run early morning, roughly 5:00-7:00 AM. Park is closed during monsoon (May-October).",
      entryFee: "Entry: approx. ₹100-200 for Indian visitors, ₹650-1,000 for foreign visitors. Jeep safari and elephant safari cost extra per vehicle/person (jeep safaris often ₹1,500+ per vehicle; elephant safaris around ₹1,500-2,000 per person).",
      bestTime: "November to April",
      famousFood: "Assamese thali, Khar (traditional Assamese dish), Duck curry",
      nearby: "Kaziranga Orchid and Biodiversity Park, tea gardens of Assam, Pobitora Wildlife Sanctuary",
      transport: "Nearest airport: Jorhat Airport (~90 km). Nearest railway station: Furkating Junction (~75 km)."
    }
  },
  {
    name: "Kamakhya Temple",
    details: {
      description: "One of the oldest of the 51 Shakti Peethas, dedicated to Goddess Kamakhya. Unlike most temples, it has no idol - the sanctum houses a natural rock formation believed to represent the goddess. A major center of Tantric and Shakti worship.",
      timings: "5:30 AM to 1:00 PM, then 2:30 PM to 5:30 PM daily.",
      entryFee: "Free general darshan. Optional VIP darshan ticket available at the counter, around ₹500 per person, for faster access.",
      bestTime: "October to March (Ambubachi Mela festival held in June draws huge crowds)",
      famousFood: "Assamese thali, sticky rice sweets, local street food near the temple complex",
      nearby: "Umananda Temple, Guwahati Zoo, Brahmaputra River cruises",
      transport: "Nearest airport: Lokpriya Gopinath Bordoloi International Airport (~20 km). Nearest railway station: Guwahati Railway Station (~7-8 km)."
    }
  },
  {
    name: "Majuli Island",
    details: {
      description: "One of the world's largest river islands, formed by the Brahmaputra River. Known as a center of Assamese neo-Vaishnavite culture, home to numerous satras (monasteries) preserving traditional art, dance, and mask-making.",
      timings: "Open all day; ferry services run on a daily schedule from Jorhat.",
      entryFee: "Free to visit the island (individual satras may request modest donations).",
      bestTime: "October to March",
      famousFood: "Apong (rice beer), Assamese thali, Majuli-style fish preparations",
      nearby: "Kamalabari Satra, Auniati Satra, Mishing tribal villages",
      transport: "Reached by ferry from Nimati Ghat near Jorhat (~20 km from Jorhat town). Nearest airport: Jorhat Airport."
    }
  },
  {
    name: "Sivasagar",
    details: {
      description: "The former capital of the Ahom kingdom, home to a cluster of historic monuments including the Rang Ghar amphitheater, Talatal Ghar, and Sivasagar Tank surrounded by ancient temples.",
      timings: "Most monuments open approximately 9:00 AM to 5:00 PM (varies by site; ASI-protected sites usually closed on Fridays).",
      entryFee: "Nominal entry fee at ASI-protected monuments (typically ₹15-25 for Indian visitors).",
      bestTime: "October to March",
      famousFood: "Assamese thali, Pitha (rice cakes), Khar",
      nearby: "Rang Ghar, Talatal Ghar, Sivasagar Tank and temples",
      transport: "Nearest airport: Jorhat Airport (~60 km). Nearest railway station: Simaluguri Junction (~20 km)."
    }
  },
  {
    name: "Manas National Park",
    details: {
      description: "A UNESCO World Heritage Site and Tiger Reserve on the Assam-Bhutan border, known for its rich biodiversity including tigers, elephants, and the rare golden langur, set along the Manas River.",
      timings: "Jeep safaris typically run in morning and afternoon slots; park generally closed during monsoon (June-September).",
      entryFee: "Approx. ₹100-250 for Indian visitors, higher for foreign visitors; safari costs charged separately per vehicle.",
      bestTime: "November to April",
      famousFood: "Assamese thali, Bodo tribal cuisine available near the park",
      nearby: "Bhutan border viewpoints, Bansbari range, Mathanguri (riverside campsite)",
      transport: "Nearest airport: Guwahati Airport (~176 km). Nearest railway station: Barpeta Road (~40 km)."
    }
  },
  {
    name: "Umananda Temple",
    details: {
      description: "A Shiva temple situated on Umananda Island (Peacock Island) in the middle of the Brahmaputra River, reachable only by boat - one of the smallest inhabited river islands in the world.",
      timings: "Approximately 8:00 AM to 1:00 PM and 3:00 PM to 6:00 PM daily.",
      entryFee: "Free entry to the temple; ferry ride to the island costs a small fee (typically under ₹50 round trip).",
      bestTime: "October to March",
      famousFood: "Street food and Assamese snacks available at the Guwahati ferry ghat",
      nearby: "Kamakhya Temple, Guwahati Zoo, Brahmaputra riverside promenade",
      transport: "Reached by a short ferry ride from Umananda Ghat in central Guwahati. Nearest airport: Guwahati Airport (~25 km)."
    }
  },

  // BATCH 4: Bihar (all 6 places)
  {
    name: "Mahabodhi Temple",
    details: {
      description: "A UNESCO World Heritage Site marking the spot where Siddhartha Gautama is believed to have attained enlightenment under the Bodhi Tree, becoming the Buddha. Originally built by Emperor Ashoka in the 3rd century BCE, it is one of the holiest Buddhist pilgrimage sites in the world.",
      timings: "5:00 AM to 9:00 PM daily (some sources note two blocks: 5:00 AM-12:00 PM and 4:00 PM-9:00 PM).",
      entryFee: "Free entry. Camera fee approx. ₹20-200, video camera fee approx. ₹300 (varies by source).",
      bestTime: "October to February",
      famousFood: "Bihari thali, Litti Chokha, Tibetan momos and thukpa near the monastery area",
      nearby: "Bodhi Tree, Great Buddha Statue, Thai Monastery, Japanese Temple",
      transport: "Nearest airport: Gaya Airport (~10-15 km). Nearest railway station: Gaya Junction (~14-17 km)."
    }
  },
  {
    name: "Nalanda Ruins",
    details: {
      description: "The remains of Nalanda Mahavihara, one of the world's first residential universities, active from around the 5th to 12th century CE. At its peak it housed thousands of students and teachers from across Asia. A UNESCO World Heritage Site today.",
      timings: "9:00 AM to 5:00 PM daily (site); Museum typically 10:00 AM to 5:00 PM, closed Fridays.",
      entryFee: "Indian nationals: approx. ₹15-40. Foreign nationals: approx. ₹200-600 (fee has varied across recent updates - confirm at the counter). Children under 15: free.",
      bestTime: "October to March",
      famousFood: "Bihari thali, Litti Chokha, Sattu-based snacks",
      nearby: "Nalanda Archaeological Museum, Rajgir (~12 km), Xuanzang Memorial Hall",
      transport: "Nearest airport: Patna Airport (~95 km) or Gaya Airport (~80 km). Nearest railway station: Rajgir or Bihar Sharif."
    }
  },
  {
    name: "Patna Sahib Gurdwara",
    details: {
      description: "Also known as Takht Sri Patna Sahib, one of the five Takhts (seats of religious authority) of Sikhism, built to mark the birthplace of Guru Gobind Singh, the tenth Sikh Guru.",
      timings: "Approximately 4:00 AM to 9:00 PM daily.",
      entryFee: "Free entry (community meals/langar also free).",
      bestTime: "October to March",
      famousFood: "Langar (free community meal served at the gurdwara), Bihari thali, Litti Chokha",
      nearby: "Golghar, Patna Museum, Gandhi Maidan",
      transport: "Nearest airport: Jay Prakash Narayan Airport, Patna (~7 km). Nearest railway station: Patna Junction (~4 km)."
    }
  },
  {
    name: "Vaishali",
    details: {
      description: "An ancient city considered one of the world's earliest republics, and a significant Buddhist and Jain pilgrimage site - Buddha delivered his last sermon here, and Mahavira, the 24th Jain Tirthankara, was born nearby.",
      timings: "Most archaeological sites open approximately 9:00 AM to 5:00 PM.",
      entryFee: "Free or nominal fee (under ₹25) at ASI-protected sites.",
      bestTime: "October to March",
      famousFood: "Bihari thali, Litti Chokha, local sweets like Khaja",
      nearby: "Ashoka Pillar, Relic Stupa, Vaishali Museum",
      transport: "Nearest airport: Patna Airport (~55 km). Nearest railway station: Hajipur (~35 km)."
    }
  },
  {
    name: "Rajgir",
    details: {
      description: "An ancient city and former capital of the Magadha kingdom, associated with both Buddha and Mahavira. Known for hot springs, the Griffith-designed Vishwa Shanti Stupa, and ancient cyclopean stone walls.",
      timings: "Most sites open approximately 8:00 AM to 5:00 PM (ropeway to Vishwa Shanti Stupa typically runs 8:00 AM-1:00 PM and 2:00 PM-5:00 PM).",
      entryFee: "Nominal entry fees at individual sites (typically ₹10-30); ropeway ticket separate, approx. ₹100-150.",
      bestTime: "October to March",
      famousFood: "Bihari thali, Litti Chokha, Thekua (traditional sweet)",
      nearby: "Nalanda Ruins (~12 km), Griddhakuta (Vulture's Peak), Rajgir Hot Springs",
      transport: "Nearest airport: Patna Airport (~90 km). Nearest railway station: Rajgir Railway Station."
    }
  },
  {
    name: "Barabar Caves",
    details: {
      description: "The oldest surviving rock-cut caves in India, dating to the Mauryan Empire (3rd century BCE), commissioned by Emperor Ashoka. Known for their polished interior walls that create a striking echo effect, and later fame from E.M. Forster's novel 'A Passage to India'.",
      timings: "Approximately 9:00 AM to 5:00 PM daily.",
      entryFee: "Free or nominal entry fee (ASI-protected site).",
      bestTime: "October to March",
      famousFood: "Bihari thali, Litti Chokha, local sattu-based snacks",
      nearby: "Nagarjuni Caves, Gaya, Bodh Gaya (day-trip distance)",
      transport: "Nearest airport: Gaya Airport (~35 km). Nearest railway station: Gaya Junction (~35 km)."
    }
  },

  // BATCH 5: Chhattisgarh (all 5 places)
  {
    name: "Chitrakoot Falls",
    details: {
      description: "Often called the 'Niagara Falls of India', this horseshoe-shaped waterfall on the Indravati River is India's widest waterfall, especially dramatic during monsoon when it can widen to nearly 300 meters.",
      timings: "Open through the evening; illuminated with lights until around 5:00-9:00 PM depending on the season.",
      entryFee: "Nominal entry fee, approx. ₹25-50 per person (parking and boating charged separately).",
      bestTime: "July to October (monsoon, for peak water flow); pleasant year-round otherwise",
      famousFood: "Chhattisgarhi thali, Bafauri, Chila (local rice pancake)",
      nearby: "Tirathgarh Falls, Kanger Valley National Park, Kutumsar Caves",
      transport: "Nearest airport: Jagdalpur Airport (~38 km) or Raipur Airport (~278 km). Nearest railway station: Jagdalpur (~38 km)."
    }
  },
  {
    name: "Bastar Palace",
    details: {
      description: "The former royal residence of the Bastar dynasty in Jagdalpur, reflecting the region's royal history and Gond-influenced architecture. Now partly used for cultural and administrative purposes.",
      timings: "Approximately 10:00 AM to 5:00 PM (exterior/grounds viewing; interior access may be limited).",
      entryFee: "Free or nominal fee for grounds access.",
      bestTime: "October to March",
      famousFood: "Chhattisgarhi thali, Bastar-style tribal cuisine, Bamboo shoot curry",
      nearby: "Danteshwari Temple, Anthropological Museum, Dalpat Sagar Lake",
      transport: "Nearest airport: Jagdalpur Airport (~5 km). Nearest railway station: Jagdalpur Railway Station (~3 km)."
    }
  },
  {
    name: "Sirpur",
    details: {
      description: "An ancient Buddhist, Hindu, and Jain archaeological site on the banks of the Mahanadi River, with excavated temples and monasteries dating back to the 5th-8th centuries, including the notable Laxman Temple.",
      timings: "Approximately 9:00 AM to 5:00 PM daily.",
      entryFee: "Nominal entry fee (typically under ₹25) at ASI-protected areas.",
      bestTime: "October to March",
      famousFood: "Chhattisgarhi thali, Faraa (steamed rice dumplings), Bafauri",
      nearby: "Laxman Temple, Gandheshwar Temple, Surang Tila",
      transport: "Nearest airport: Raipur Airport (~78 km). Nearest railway station: Mahasamund (~35 km)."
    }
  },
  {
    name: "Kanger Valley National Park",
    details: {
      description: "A biodiversity-rich national park and Asian Biosphere Reserve, home to tigers, leopards, and rare species, along with dramatic limestone caves (Kutumsar, Kailash) and the Tirathgarh waterfall.",
      timings: "Approximately 7:00-8:00 AM to 4:00-6:00 PM (varies by season; closed during monsoon months for cave visits).",
      entryFee: "Indian nationals: approx. ₹25-30. Foreign nationals: approx. ₹150-200. Vehicle entry and guide fees charged separately.",
      bestTime: "October to March (monsoon closes cave access)",
      famousFood: "Chhattisgarhi thali; pre-booked vegetarian forest meals available at the entrance gate",
      nearby: "Tirathgarh Falls, Kutumsar Caves, Kailash Caves",
      transport: "Nearest airport: Jagdalpur Airport (~24 km). Nearest railway station: Jagdalpur (~24 km)."
    }
  },
  {
    name: "Bhoramdeo Temple",
    details: {
      description: "An 11th-century Nagara-style temple complex often called the 'Khajuraho of Chhattisgarh' for its intricately carved sculptures, dedicated to Lord Shiva.",
      timings: "Approximately 6:00 AM to 6:00 PM daily.",
      entryFee: "Free entry (donations welcome).",
      bestTime: "October to March",
      famousFood: "Chhattisgarhi thali, Muthia, Aamat (tribal Bastar dish)",
      nearby: "Kabirdham town, Chaiturgarh Fort, Madwa Mahal",
      transport: "Nearest airport: Raipur Airport (~130 km). Nearest railway station: Kawardha (~18 km)."
    }
  },

  // BATCH 6: Goa (all 7 places)
  {
    name: "Baga Beach",
    details: {
      description: "One of North Goa's most popular and lively beaches, known for water sports, beach shacks, nightlife, and its famous Saturday Night Market nearby.",
      timings: "Open 24 hours (water sports typically operate 9:00 AM to 6:00 PM).",
      entryFee: "Free (water sports and beach activities charged separately, typically ₹300-1,500 depending on activity).",
      bestTime: "November to February",
      famousFood: "Goan fish curry rice, prawn balchão, feni (local cashew liquor), beach shack seafood",
      nearby: "Calangute Beach, Anjuna Flea Market, Saturday Night Market",
      transport: "Nearest airport: Goa International Airport, Dabolim (~40 km) or Manohar International Airport (~35 km). Nearest railway station: Thivim (~20 km)."
    }
  },
  {
    name: "Basilica of Bom Jesus",
    details: {
      description: "A UNESCO World Heritage Site and one of Goa's oldest churches, famous for holding the preserved remains of St. Francis Xavier. Known for its Baroque architecture and unplastered laterite exterior.",
      timings: "9:00 AM to 6:30 PM, Monday to Saturday. 10:30 AM to 6:30 PM on Sundays.",
      entryFee: "Free entry (donations welcome).",
      bestTime: "November to February",
      famousFood: "Goan sorpotel, bebinca (traditional Goan dessert), local Old Goa street snacks",
      nearby: "Se Cathedral, Church of St. Cajetan, Museum of Christian Art",
      transport: "Nearest airport: Goa International Airport, Dabolim (~30 km). Nearest railway station: Karmali (~12 km)."
    }
  },
  {
    name: "Dudhsagar Falls",
    details: {
      description: "One of India's tallest waterfalls at around 300 meters, located in the Bhagwan Mahaveer Wildlife Sanctuary on the Goa-Karnataka border. Its name means 'sea of milk', referring to the frothy white water cascading down.",
      timings: "Jeep safaris typically run 6:00 AM to 4:30-5:30 PM. Closed or restricted during peak monsoon (June-September) due to safety.",
      entryFee: "Jeep safari: approx. ₹450-1,000 per person (or ₹2,400 per jeep). Forest entry and camera fees charged separately (still camera ~₹50-300).",
      bestTime: "October to May (most dramatic flow just after monsoon, October-November)",
      famousFood: "Goan thali, spice plantation tour meals (often included in jeep safari packages)",
      nearby: "Bhagwan Mahaveer Wildlife Sanctuary, Tambdi Surla Temple, Devil's Canyon",
      transport: "Nearest railway station: Castle Rock or Kulem (~12 km from the falls, jeep safaris start here). Nearest airport: Goa International Airport, Dabolim (~80 km)."
    }
  },
  {
    name: "Fort Aguada",
    details: {
      description: "A well-preserved 17th-century Portuguese fort overlooking the Arabian Sea, built to defend against Dutch and Maratha invasions. Includes a lighthouse and offers panoramic coastal views.",
      timings: "Approximately 9:30 AM to 6:00 PM daily.",
      entryFee: "Free entry to the fort grounds (lighthouse access may have a nominal fee).",
      bestTime: "November to February",
      famousFood: "Goan seafood thali, prawn curry, local beach shack fare nearby",
      nearby: "Sinquerim Beach, Candolim Beach, Aguada Jail Museum",
      transport: "Nearest airport: Goa International Airport, Dabolim (~24 km). Nearest railway station: Thivim (~18 km)."
    }
  },
  {
    name: "Palolem Beach",
    details: {
      description: "A crescent-shaped beach in South Goa, known for its calmer waters, palm-fringed shoreline, and laid-back atmosphere compared to North Goa's busier beaches.",
      timings: "Open 24 hours (best visited during daylight; some silent noise restrictions apply at night).",
      entryFee: "Free (water sports and dolphin-watching boat trips charged separately, typically ₹300-800).",
      bestTime: "November to February",
      famousFood: "Goan fish thali, kingfish curry, fresh seafood at beach shacks",
      nearby: "Butterfly Beach (boat access), Cotigao Wildlife Sanctuary, Agonda Beach",
      transport: "Nearest airport: Goa International Airport, Dabolim (~40 km). Nearest railway station: Canacona (~3 km)."
    }
  },
  {
    name: "Se Cathedral",
    details: {
      description: "One of the largest churches in Asia, built by the Portuguese in the 16th century in Old Goa, dedicated to St. Catherine of Alexandria. Known for its Golden Bell, one of the largest in the world.",
      timings: "Approximately 7:30 AM to 6:30 PM daily.",
      entryFee: "Free entry (donations welcome).",
      bestTime: "November to February",
      famousFood: "Goan sorpotel, bebinca, local Old Goa snacks",
      nearby: "Basilica of Bom Jesus, Church of St. Francis of Assisi, Archaeological Museum",
      transport: "Nearest airport: Goa International Airport, Dabolim (~30 km). Nearest railway station: Karmali (~12 km)."
    }
  },
  {
    name: "Anjuna Flea Market",
    details: {
      description: "A famous open-air market held weekly in Anjuna, North Goa, known for handmade crafts, clothing, jewelry, and a lively bohemian atmosphere that dates back to the hippie era of the 1960s-70s.",
      timings: "Every Wednesday, approximately 8:00 AM to sunset (best visited in the afternoon for full stall activity).",
      entryFee: "Free entry (prices at stalls are negotiable).",
      bestTime: "November to March (market operates mainly during peak tourist season)",
      famousFood: "Goan street food, seafood stalls, fresh coconut water, local snacks at the market",
      nearby: "Anjuna Beach, Curlies Beach Shack area, Chapora Fort",
      transport: "Nearest airport: Goa International Airport, Dabolim (~45 km). Nearest railway station: Thivim (~18 km)."
    }
  },

  // BATCH 7: Gujarat (all 7 places)
  {
    name: "Statue of Unity",
    details: {
      description: "The world's tallest statue at 182 metres, honoring Sardar Vallabhbhai Patel, who played a key role in unifying India after independence. Located at Ekta Nagar (Kevadia) near the Sardar Sarovar Dam, with a viewing gallery offering panoramic views.",
      timings: "Open Tuesday to Sunday, approximately 9:00 AM to 6:00 PM. Closed every Monday for maintenance (even on national holidays). Laser light show held in the evening after sunset.",
      entryFee: "General complex entry: approx. ₹150. Viewing Gallery ticket: approx. ₹350-380 for Indian adults (higher for foreign nationals). Combo tickets bundling multiple attractions available at a discount.",
      bestTime: "October to February",
      famousFood: "Gujarati thali, Dhokla, Fafda-Jalebi",
      nearby: "Sardar Sarovar Dam, Valley of Flowers, Sardar Sarovar Zoo (Jungle Safari)",
      transport: "Nearest airport: Vadodara Airport (~90 km). Nearest railway station: Kevadia Railway Station (well connected to major cities)."
    }
  },
  {
    name: "Rann of Kutch",
    details: {
      description: "One of the largest salt marshes in the world, famous for its stark white salt desert landscape, especially dramatic under moonlight. Hosts the annual Rann Utsav festival with cultural performances, tents, and desert activities.",
      timings: "Best visited during daylight and evening; the White Rann viewing area typically has restricted timings tied to the Rann Utsav season (roughly November to February).",
      entryFee: "Nominal entry fee to the White Rann viewpoint (typically under ₹100 per person; vehicle charges extra).",
      bestTime: "November to February (during Rann Utsav)",
      famousFood: "Kutchi Dabeli, Gujarati thali, Kutchi Kadhi, local desert-camp cuisine during Rann Utsav",
      nearby: "Kalo Dungar (Black Hill), Dholavira (Harappan site), Kutch Rann Utsav tent city",
      transport: "Nearest airport: Bhuj Airport (~85 km to White Rann). Nearest railway station: Bhuj Railway Station."
    }
  },
  {
    name: "Somnath Temple",
    details: {
      description: "One of the twelve Jyotirlinga shrines of Lord Shiva, considered among the most sacred Hindu pilgrimage sites. The temple has been destroyed and rebuilt multiple times through history, with the current structure completed in the mid-20th century.",
      timings: "Approximately 6:00 AM to 9:00 PM daily. Light and sound show held in the evening (around 7:45-8:45 PM, seasonal).",
      entryFee: "Free entry (donations welcome). Light and sound show may have a nominal ticket price.",
      bestTime: "October to March",
      famousFood: "Gujarati thali, fresh seafood (coastal location), Sev Tameta nu Shaak",
      nearby: "Bhalka Tirth, Somnath Beach, Junagadh (day-trip distance)",
      transport: "Nearest airport: Diu Airport (~65 km) or Rajkot Airport (~200 km). Nearest railway station: Veraval (~7 km)."
    }
  },
  {
    name: "Sabarmati Ashram",
    details: {
      description: "Mahatma Gandhi's residence from 1917 to 1930 on the banks of the Sabarmati River, and the starting point of the historic Dandi Salt March. Now a museum preserving Gandhi's living quarters, writings, and photographs.",
      timings: "Approximately 8:30 AM to 6:30 PM daily.",
      entryFee: "Free entry.",
      bestTime: "October to March",
      famousFood: "Gujarati thali, Dhokla, Khandvi, Fafda-Jalebi",
      nearby: "Sardar Patel National Memorial, Sabarmati Riverfront, Adalaj Stepwell",
      transport: "Nearest airport: Sardar Vallabhbhai Patel International Airport, Ahmedabad (~15 km). Nearest railway station: Ahmedabad Junction (~7 km)."
    }
  },
  {
    name: "Gir National Park",
    details: {
      description: "The only place in the world where Asiatic lions live in the wild. A dry deciduous forest sanctuary in Junagadh district, also home to leopards, deer species, and diverse birdlife.",
      timings: "Open mid-October to mid-June (closed during monsoon, mid-June to mid-October). Morning safari approx. 6:00-9:30 AM, evening safari approx. 3:00-6:00 PM.",
      entryFee: "Indian nationals: approx. ₹50-75 entry + ₹400-600 safari vehicle fee. Foreign nationals: approx. ₹500 entry + similar vehicle fee. Guide fee approx. ₹500-700. Advance online booking strongly recommended.",
      bestTime: "December to March",
      famousFood: "Gujarati thali, Kathiyawadi cuisine, Gir-region dairy products (the area is known for its Gir cow breed)",
      nearby: "Somnath Temple (~55 km), Junagadh, Devalia Safari Park (Interpretation Zone)",
      transport: "Nearest airport: Rajkot Airport (~158 km). Nearest railway station: Junagadh (~55 km) or Sasan Gir Railway Station (closer, limited connectivity)."
    }
  },
  {
    name: "Dwarkadhish Temple",
    details: {
      description: "An ancient temple dedicated to Lord Krishna, located in Dwarka, one of the four sacred Char Dham pilgrimage sites in India. The current structure dates back roughly 2,200 years with later additions.",
      timings: "Approximately 6:30 AM to 1:00 PM and 5:00 PM to 9:30 PM daily.",
      entryFee: "Free entry (donations welcome).",
      bestTime: "October to March",
      famousFood: "Gujarati thali, Khichdi Kadhi, Dwarka's famous Lilva Kachori",
      nearby: "Rukmini Devi Temple, Bet Dwarka (island), Nageshwar Jyotirlinga",
      transport: "Nearest airport: Jamnagar Airport (~145 km) or Porbandar Airport (~110 km). Nearest railway station: Dwarka Railway Station (~2 km)."
    }
  },
  {
    name: "Laxmi Vilas Palace",
    details: {
      description: "A grand royal palace in Vadodara built by the Gaekwad dynasty in the late 19th century, said to be four times the size of Buckingham Palace. Known for its Indo-Saracenic architecture and still partly used as a royal residence.",
      timings: "Approximately 10:00 AM to 5:00 PM daily (last entry earlier).",
      entryFee: "Approx. ₹250-350 for Indian adults, higher for foreign visitors (audio guide often included).",
      bestTime: "October to March",
      famousFood: "Gujarati thali, Vadodara's famous Sev Usal, Locho",
      nearby: "Maharaja Fateh Singh Museum, Sayaji Baug, Kirti Mandir",
      transport: "Nearest airport: Vadodara Airport (~8 km). Nearest railway station: Vadodara Junction (~4 km)."
    }
  },

  // BATCH 8: Haryana (all 5 places)
  {
    name: "Kurukshetra",
    details: {
      description: "A historic city considered the sacred battlefield of the Mahabharata, where Lord Krishna is believed to have delivered the Bhagavad Gita to Arjuna. Home to numerous temples, tanks, and the Brahma Sarovar.",
      timings: "Most temple sites open approximately 5:00 AM to 9:00 PM (Brahma Sarovar and outdoor areas accessible all day).",
      entryFee: "Free entry to most sites (Sri Krishna Museum charges a nominal ticket, typically under ₹25).",
      bestTime: "October to March",
      famousFood: "Haryanvi thali, Bajra Khichdi, Kachri ki Sabzi",
      nearby: "Brahma Sarovar, Jyotisar (site of the Gita's recitation), Sri Krishna Museum",
      transport: "Nearest airport: Chandigarh Airport (~90 km). Nearest railway station: Kurukshetra Junction."
    }
  },
  {
    name: "Sultanpur Bird Sanctuary",
    details: {
      description: "A protected wetland sanctuary near Gurugram, popular among birdwatchers for hosting migratory birds from Siberia, Europe, and Central Asia during winter months, alongside resident species.",
      timings: "Approximately 7:00 AM to 4:30 PM daily (closed on Tuesdays at some periods - check locally).",
      entryFee: "Nominal entry fee (typically under ₹50 for Indian visitors; camera fees may apply separately).",
      bestTime: "November to March (peak migratory bird season)",
      famousFood: "Haryanvi thali, Bajra Roti with Sarson Saag, Lassi",
      nearby: "Sultanpur village, Damdama Lake, Gurugram city attractions",
      transport: "Nearest airport: Indira Gandhi International Airport, Delhi (~45 km). Nearest railway station: Gurugram Railway Station (~15 km)."
    }
  },
  {
    name: "Pinjore Gardens",
    details: {
      description: "Also known as Yadavindra Gardens, a 17th-century Mughal-style terraced garden built by Nawab Fidai Khan, later restored by the Patiala royal family. Features seven terraces, fountains, and historic pavilions like the Sheesh Mahal.",
      timings: "7:00 AM to 9:30-10:00 PM daily.",
      entryFee: "Approx. ₹20-30 per person (children under 3 free).",
      bestTime: "October to March (Mango Festival held in June-July)",
      famousFood: "Haryanvi thali, local snacks at the on-site restaurant, seasonal mangoes during the festival",
      nearby: "Chandigarh (~22 km), Kalka, Morni Hills",
      transport: "Nearest airport: Chandigarh Airport (~25 km). Nearest railway station: Kalka Railway Station (~7 km)."
    }
  },
  {
    name: "Sheikh Chilli's Tomb",
    details: {
      description: "A 17th-century Mughal-era tomb complex in Kurukshetra dedicated to the Sufi saint Sheikh Chilli, known for its blend of Persian and Mughal architectural styles including a distinctive blue-tiled dome.",
      timings: "Approximately 9:00 AM to 5:00 PM daily.",
      entryFee: "Nominal entry fee (typically under ₹25).",
      bestTime: "October to March",
      famousFood: "Haryanvi thali, Bajra Khichdi, local sweets",
      nearby: "Kurukshetra University, Brahma Sarovar, Jyotisar",
      transport: "Nearest airport: Chandigarh Airport (~90 km). Nearest railway station: Kurukshetra Junction (~3 km)."
    }
  },
  {
    name: "Morni Hills",
    details: {
      description: "The only hill station in Haryana, located in the lower Shivalik range near Panchkula, known for its two natural lakes (Tikkar Taal), pine forests, and a historic 400-year-old fort.",
      timings: "Open all day; best visited during daylight hours.",
      entryFee: "Free (activities like boating at Tikkar Taal charged separately, typically under ₹100).",
      bestTime: "October to March",
      famousFood: "Haryanvi thali, Bajra Roti, seasonal fruits from local orchards",
      nearby: "Tikkar Taal, Morni Fort, Thandi Sadak viewpoint",
      transport: "Nearest airport: Chandigarh Airport (~45 km). Nearest railway station: Chandigarh Railway Station (~40 km)."
    }
  },

  // BATCH 9: Himachal Pradesh (all 8 places)
  {
    name: "Rohtang Pass",
    details: {
      description: "A high mountain pass at about 13,050 feet in the Pir Panjal range, connecting Manali to the Lahaul-Spiti valley. Famous for dramatic snow-capped scenery, though heavily regulated to control tourist traffic and pollution.",
      timings: "Open daily during the tourist season (roughly late May to October/November), subject to weather and BRO road clearance. Permit entry windows released at 10:00 AM and 4:00 PM daily.",
      entryFee: "A vehicle permit is mandatory: approx. ₹550 total (₹500 permit + ₹50 congestion charge) for cars/jeeps, applied for online in advance. Daily quota is limited, so early booking is essential.",
      bestTime: "June to September (accessible season; snow activities best June-July)",
      famousFood: "Himachali Dham, Siddu, hot Maggi and tea at roadside stalls near the pass",
      nearby: "Solang Valley, Atal Tunnel, Marhi",
      transport: "Nearest airport: Bhuntar Airport, Kullu (~52 km). Nearest railway station: Joginder Nagar (~150 km, narrow gauge) - most visitors travel by road from Manali."
    }
  },
  {
    name: "Hadimba Temple",
    details: {
      description: "A 16th-century wooden temple in Manali dedicated to Hidimba Devi, a figure from the Mahabharata, set amid a scenic cedar forest. Known for its unique pagoda-style architecture, unusual for a Hindu temple.",
      timings: "Approximately 8:00 AM to 6:00 PM daily.",
      entryFee: "Free entry (donations welcome; nominal camera fee may apply).",
      bestTime: "March to June, and October to November",
      famousFood: "Himachali Dham, Siddu, Trout fish (Manali specialty), hot momos nearby",
      nearby: "Manu Temple, Old Manali market, Van Vihar",
      transport: "Nearest airport: Bhuntar Airport, Kullu (~50 km). Nearest railway station: Joginder Nagar (~165 km)."
    }
  },
  {
    name: "Kufri Slopes",
    details: {
      description: "A small hill station near Shimla known for winter skiing, horse riding, and views of the Himalayan ranges, plus the Kufri Fun World amusement park and Himalayan Nature Park.",
      timings: "Open all day; ski/adventure activities typically run 9:00 AM to 5:00 PM.",
      entryFee: "Free to visit the area; activities like skiing, horse riding, or Kufri Fun World charge separately (typically ₹100-500 per activity).",
      bestTime: "December to February (for snow), March to June (for pleasant weather)",
      famousFood: "Himachali Dham, Chana Madra, hot tea and Maggi at viewpoint stalls",
      nearby: "Himalayan Nature Park, Fagu, Mahasu Peak",
      transport: "Nearest airport: Shimla Airport (~22 km). Nearest railway station: Shimla Railway Station (~16 km, narrow gauge toy train)."
    }
  },
  {
    name: "Dharamshala & McLeod Ganj",
    details: {
      description: "A hill town that serves as the residence of the Dalai Lama and hub of the Tibetan government-in-exile. McLeod Ganj, its upper section, blends Tibetan Buddhist culture, monasteries, and cafes with Himalayan mountain views.",
      timings: "Open all day; the Tsuglagkhang Temple complex typically open approximately 5:00 AM to 8:00 PM.",
      entryFee: "Free entry to most monasteries and public areas (donations welcome).",
      bestTime: "March to June, and September to November",
      famousFood: "Tibetan momos, thukpa, Himachali Dham",
      nearby: "Bhagsu Waterfall, Triund trek, Namgyal Monastery",
      transport: "Nearest airport: Kangra Airport, Gaggal (~15 km). Nearest railway station: Pathankot (~85 km, narrow gauge to Kangra also available)."
    }
  },
  {
    name: "Spiti Valley",
    details: {
      description: "A remote, high-altitude cold desert valley bordering Tibet, known for ancient Buddhist monasteries, dramatic barren landscapes, and villages among the highest inhabited places in the world.",
      timings: "Open all day; accessible roughly May/June to October (heavy snow closes routes in winter).",
      entryFee: "Free to enter the valley (Inner Line Permit required for certain border-adjacent areas near Tibet).",
      bestTime: "June to September (accessible road season)",
      famousFood: "Thukpa, momos, Sattu-based dishes, local barley beer (Chhaang)",
      nearby: "Key Monastery, Chandratal Lake, Kaza town",
      transport: "Nearest airport: Bhuntar Airport, Kullu (~245 km via Manali route, seasonal). Nearest railway station: Joginder Nagar or Shimla, both several hours away by road."
    }
  },
  {
    name: "Kasol",
    details: {
      description: "A small riverside village in the Parvati Valley, popular as a backpacker hub with Israeli-influenced cafes, trekking bases, and scenic mountain surroundings along the Parvati River.",
      timings: "Open all day; village and riverside areas accessible year-round (weather permitting).",
      entryFee: "Free to visit the village.",
      bestTime: "March to June, and September to November",
      famousFood: "Israeli cuisine (hummus, shakshuka), Himachali Dham, Trout fish",
      nearby: "Manikaran Sahib, Tosh village, Kheerganga trek",
      transport: "Nearest airport: Bhuntar Airport, Kullu (~40 km). Nearest railway station: Joginder Nagar (~140 km)."
    }
  },
  {
    name: "Chail",
    details: {
      description: "A quiet hill station once the summer capital of the Patiala royal family, home to the world's highest cricket ground and the Chail Palace, set amid dense pine and deodar forests.",
      timings: "Open all day; Chail Wildlife Sanctuary typically 9:00 AM to 5:00 PM.",
      entryFee: "Free to explore the town (Chail Wildlife Sanctuary entry approx. ₹50; Chail Palace grounds may have a nominal fee).",
      bestTime: "March to June, and September to November",
      famousFood: "Himachali Dham, Siddu, Chana Madra",
      nearby: "Chail Palace, Kali ka Tibba, Sadhupul",
      transport: "Nearest airport: Shimla Airport (~50 km). Nearest railway station: Kalka Railway Station (~85 km)."
    }
  },
  {
    name: "Bir Billing",
    details: {
      description: "A village in the Kangra district known as one of the world's best paragliding destinations, with Billing serving as the take-off point and Bir as the landing site. Also home to a significant Tibetan settlement.",
      timings: "Paragliding typically operates 10:00 AM to 4:00 PM, weather permitting.",
      entryFee: "Free to visit; tandem paragliding costs approx. ₹2,000-3,500 per person depending on flight duration.",
      bestTime: "March to June, and September to November (October-November best for paragliding conditions)",
      famousFood: "Tibetan momos, thukpa, Himachali Dham",
      nearby: "Chougan (paragliding landing site), Tibetan Monastery, Baijnath Temple",
      transport: "Nearest airport: Kangra Airport, Gaggal (~65 km). Nearest railway station: Joginder Nagar (~40 km)."
    }
  },

  // BATCH 10: Jharkhand (all 5 places)
  {
    name: "Betla National Park",
    details: {
      description: "One of India's earliest Project Tiger reserves, located in the Palamu district. Home to tigers, elephants, bison, and dense sal forests, alongside historic Palamu Fort ruins within the park.",
      timings: "Approximately 6:00 AM to 6:00 PM daily; jeep safaris typically run in morning and afternoon slots.",
      entryFee: "Nominal entry fee (typically ₹50-100 for Indian visitors); jeep safari charged separately, approx. ₹1,000-1,500 per vehicle.",
      bestTime: "November to April (park may restrict access during peak monsoon)",
      famousFood: "Jharkhandi thali, Dhuska, Litti Chokha",
      nearby: "Palamu Fort ruins, Kechki (river confluence), Lodh Falls",
      transport: "Nearest airport: Ranchi Airport (~170 km). Nearest railway station: Daltonganj (~25 km)."
    }
  },
  {
    name: "Baidyanath Temple",
    details: {
      description: "Also known as Baidyanath Dham, one of the twelve Jyotirlinga shrines of Lord Shiva and also considered a Shakti Peetha. A major pilgrimage site, especially during the month of Shravan when millions walk from Sultanganj carrying holy Ganges water.",
      timings: "Approximately 4:00 AM to 3:30 PM, then 6:00 PM to 9:00 PM daily (hours extend significantly during Shravan month).",
      entryFee: "Free general darshan. Quick/expedited darshan (Sheeghra Darshanam) ticket available, approx. ₹200.",
      bestTime: "October to March (for a peaceful visit; Shravan month, roughly July-August, is the most significant but extremely crowded time)",
      famousFood: "Jharkhandi thali, Litti Chokha, Peda (local sweet)",
      nearby: "Naulakha Mandir, Tapovan Caves, Trikuta Parvat",
      transport: "Nearest airport: Deoghar Airport (~12 km). Nearest railway station: Jasidih Junction (~7 km), with a branch line to Baidyanath Dham station."
    }
  },
  {
    name: "Hundru Falls",
    details: {
      description: "One of Jharkhand's tallest waterfalls, formed by the Subarnarekha River dropping about 98 meters near Ranchi, surrounded by rocky terrain popular for short treks and picnics.",
      timings: "Approximately 6:00 AM to 6:00 PM daily.",
      entryFee: "Nominal entry fee (typically under ₹50; vehicle parking charged separately).",
      bestTime: "October to February (monsoon, July-September, offers the most dramatic water flow but slippery conditions)",
      famousFood: "Jharkhandi thali, Dhuska, Litti Chokha, roadside snacks near the falls",
      nearby: "Jonha Falls, Dassam Falls, Ranchi city attractions",
      transport: "Nearest airport: Birsa Munda Airport, Ranchi (~45 km). Nearest railway station: Ranchi Railway Station (~40 km)."
    }
  },
  {
    name: "Netarhat",
    details: {
      description: "A scenic hill station in the Latehar district known as the 'Queen of Chotanagpur', famous for sunrise and sunset viewpoints, pine forests, and cooler climate compared to the rest of Jharkhand.",
      timings: "Open all day; sunrise/sunset points best visited around dawn and dusk respectively.",
      entryFee: "Free to visit the hill station and most viewpoints.",
      bestTime: "October to March",
      famousFood: "Jharkhandi thali, Litti Chokha, Handia (local rice beer, tribal specialty)",
      nearby: "Netarhat Dam, Magnolia Sunset Point, Upper Ghaghri Falls",
      transport: "Nearest airport: Ranchi Airport (~155 km). Nearest railway station: Barwadih (~45 km)."
    }
  },
  {
    name: "Parasnath Hill",
    details: {
      description: "The highest mountain peak in Jharkhand and the most important pilgrimage site for Jains, believed to be the place where 20 of the 24 Jain Tirthankaras attained liberation (moksha). The summit hosts numerous temples (Sammed Shikharji).",
      timings: "Trekking to the summit typically starts early morning (around 3:00-4:00 AM) to complete before midday heat; temples generally accessible through the day.",
      entryFee: "Free entry (donations welcome; palanquin/porter services available for a fee for those unable to trek).",
      bestTime: "October to March",
      famousFood: "Jain-friendly vegetarian thali, Litti Chokha, local sweets in nearby Madhuban town",
      nearby: "Madhuban town (base for the trek), Parasnath Wildlife Sanctuary, various Jain temples en route",
      transport: "Nearest airport: Ranchi Airport (~165 km) or Kolkata Airport (~275 km). Nearest railway station: Parasnath Railway Station (~25 km from Madhuban)."
    }
  },

  // BATCH 11: Karnataka (all 7 places)
  {
    name: "Hampi Ruins",
    details: {
      description: "A UNESCO World Heritage Site and the former capital of the Vijayanagara Empire, spread across a dramatic boulder-strewn landscape. Features temple complexes, royal enclosures, and the iconic Stone Chariot at the Vittala Temple.",
      timings: "Most ruins open sunrise to sunset, free to explore. Ticketed monuments (Vittala Temple, Elephant Stables/Zenana Enclosure) approx. 8:30 AM to 5:30 PM.",
      entryFee: "A combined ASI ticket covering Vittala Temple, Lotus Mahal, and Elephant Stables: approx. ₹30-40 for Indian nationals, ₹500-600 for foreign nationals (valid one day). Virupaksha Temple charges a separate nominal fee. Most other ruins are free.",
      bestTime: "October to February",
      famousFood: "Karnataka thali, Bisi Bele Bath, local banana chips (Hampi region is known for bananas)",
      nearby: "Virupaksha Temple, Matanga Hill, Hampi Bazaar",
      transport: "Nearest airport: Ballari Airport (~64 km). Nearest railway station: Hosapete/Hospet (~10 km)."
    }
  },
  {
    name: "Mysore Palace",
    details: {
      description: "The former royal residence of the Wadiyar dynasty, blending Hindu, Muslim, Rajput, and Gothic architectural styles. Illuminated with tens of thousands of bulbs during Dasara and on Sundays/holidays, it is one of India's most visited monuments.",
      timings: "10:00 AM to 5:30 PM daily. Illumination on Sundays and public holidays: 7:00-8:00 PM. Sound and light show most evenings (varies by day and language).",
      entryFee: "Approx. ₹40-70 for Indian adults, ₹20-30 for children/students, ₹200-1,000 for foreign nationals (figures vary across sources - confirm current rate at the counter). Photography inside the palace is prohibited.",
      bestTime: "October to March (Dasara festival, typically September-October, is the most spectacular time to visit)",
      famousFood: "Mysore Pak (famous local sweet), Karnataka thali, Mysore Masala Dosa",
      nearby: "Chamundi Hills, Jaganmohan Palace, Karanji Lake",
      transport: "Nearest airport: Mysore Airport (~10 km). Nearest railway station: Mysuru Junction (~2 km)."
    }
  },
  {
    name: "Coorg Hills",
    details: {
      description: "Also known as Kodagu, a lush hill region in the Western Ghats famous for coffee and spice plantations, misty hills, and Kodava culture. A popular destination for nature walks, waterfalls, and coffee estate stays.",
      timings: "Open all day; individual attractions (falls, viewpoints) typically 9:00 AM to 5:00-6:00 PM.",
      entryFee: "Free to explore the region (individual attractions like Abbey Falls or Nagarhole safaris charge separately, typically ₹30-500).",
      bestTime: "October to March",
      famousFood: "Coorg-style Pandi Curry (pork), Kadambuttu, Coorg filter coffee",
      nearby: "Abbey Falls, Raja's Seat, Nagarhole National Park",
      transport: "Nearest airport: Mangalore Airport (~135 km) or Bengaluru Airport (~260 km). Nearest railway station: Mysuru (~120 km)."
    }
  },
  {
    name: "Gokarna Beach",
    details: {
      description: "A temple town and beach destination on the Karnataka coast, known for its more relaxed, less commercialized beaches (Om Beach, Kudle Beach) compared to Goa, alongside the significant Mahabaleshwar Temple.",
      timings: "Beaches open 24 hours; Mahabaleshwar Temple approximately 6:00 AM to 1:00 PM and 4:00 PM to 8:30 PM.",
      entryFee: "Free entry to beaches and the temple (donations welcome at temple).",
      bestTime: "October to March",
      famousFood: "Karnataka coastal seafood, Neer Dosa, Mangalorean fish curry",
      nearby: "Om Beach, Kudle Beach, Mahabaleshwar Temple",
      transport: "Nearest airport: Hubli Airport (~140 km) or Goa Dabolim Airport (~150 km). Nearest railway station: Gokarna Road (~9 km)."
    }
  },
  {
    name: "Jog Falls",
    details: {
      description: "One of India's tallest waterfalls, formed by the Sharavathi River dropping approximately 253 meters in four distinct segments (Raja, Rani, Roarer, and Rocket). Most dramatic during and just after monsoon.",
      timings: "Approximately 6:00 AM to 6:00 PM daily (viewpoint access; the falls themselves are visible from viewing platforms).",
      entryFee: "Nominal entry fee (typically under ₹50; parking charged separately).",
      bestTime: "August to November (monsoon and just after, for peak water flow)",
      famousFood: "Karnataka thali, Neer Dosa, local Malnad-style cuisine",
      nearby: "Sharavathi Wildlife Sanctuary, Linganamakki Dam, Honnemaradu",
      transport: "Nearest airport: Shimoga Airport (~90 km) or Mangalore Airport (~140 km). Nearest railway station: Talaguppa (~16 km)."
    }
  },
  {
    name: "Badami Caves",
    details: {
      description: "A set of four rock-cut cave temples carved into sandstone cliffs in the 6th century, dedicated to Hindu and Jain deities, showcasing early Chalukyan architecture and intricate sculptural work.",
      timings: "Approximately 9:00 AM to 5:30 PM daily.",
      entryFee: "Indian nationals: approx. ₹25-40. Foreign nationals: approx. ₹300-600. Children under 15: free.",
      bestTime: "October to March",
      famousFood: "Karnataka thali, Jolada Rotti (jowar flatbread), Badami-region local cuisine",
      nearby: "Badami Fort, Agastya Lake, Pattadakal (UNESCO site, ~22 km)",
      transport: "Nearest airport: Belgaum Airport (~150 km) or Hubli Airport (~105 km). Nearest railway station: Badami Railway Station (~5 km)."
    }
  },
  {
    name: "Bandipur National Park",
    details: {
      description: "One of India's premier tiger reserves, part of the Nilgiri Biosphere Reserve, home to tigers, elephants, leopards, and diverse wildlife across dry deciduous forest.",
      timings: "Safaris typically run in two slots: approx. 6:00-9:00 AM and 3:00-6:00 PM. Closed on certain days for maintenance (varies).",
      entryFee: "Entry approx. ₹100-300 for Indian visitors; safari (bus or jeep) charged separately, jeep safaris typically ₹2,000-4,000 per vehicle.",
      bestTime: "October to May (dry season improves wildlife visibility)",
      famousFood: "Karnataka thali, Mysore-style Bisi Bele Bath, filter coffee",
      nearby: "Mudumalai National Park (Tamil Nadu border), Nagarhole National Park, Ooty (day-trip distance)",
      transport: "Nearest airport: Mysore Airport (~80 km) or Coimbatore Airport (~140 km). Nearest railway station: Mysuru Junction (~80 km)."
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