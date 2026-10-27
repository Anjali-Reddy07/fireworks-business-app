-- =========================================================================
-- SEED DATA: Realistic Fictional Indian Fireworks Catalogue
-- =========================================================================

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon_name)
VALUES
  ('cat-sparklers', 'Sparklers (Phooljhadi)', 'sparklers', 'Low-smoke, dazzling gold, silver, and color sparklers safe for families.', 'Sparkles'),
  ('cat-flowerpots', 'Flower Pots (Anar)', 'flower-pots', 'Towering fountains of golden showers, tri-colour bursts, and crackling stars.', 'Flame'),
  ('cat-spinners', 'Ground Spinners (Chakkars)', 'ground-spinners', 'High-speed spinning wheels of vibrant multi-colored light and whistling effects.', 'Disc'),
  ('cat-skyshots', 'Aerial Sky Shots & Shells', 'sky-shots', 'Multi-burst repeaters painting the night sky with brocades and peonies.', 'Rocket'),
  ('cat-sound', 'Sound & Thunder Crackers', 'sound-crackers', 'Green cracker certified sound bursts compliant with decibel standards.', 'Volume2'),
  ('cat-giftboxes', 'Festive Family Gift Hampers', 'gift-boxes', 'Curated assortment boxes packed with sparklers, pots, chakkars, and novelties.', 'Package')
ON CONFLICT (id) DO NOTHING;

-- Insert Certified Green Cracker Products
INSERT INTO public.products (
  id, name, category_id, category_name, description, retail_price, stock_quantity,
  sound_level, duration_seconds, pieces_per_pack, is_green_cracker, green_cracker_code,
  safety_distance_meters, image_url, active, featured
) VALUES
  ('prod-001', '30cm Royal Golden Sparklers (10 Pcs)', 'cat-sparklers', 'Sparklers (Phooljhadi)', 'Extra long 30cm premium gold sparklers with extended burning duration of 120 seconds. Minimal smoke formula certified by CSIR-NEERI.', 180, 145, 'No Sound (Visual Sparkle)', 120, 10, true, 'NEERI-GC-SPK-901', 2, 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80', true, true),
  ('prod-002', 'Tri-Colour Magic Electric Sparklers', 'cat-sparklers', 'Sparklers (Phooljhadi)', 'Features sequential red, green, and silver spark emissions. Child-friendly handle with heat insulator.', 220, 88, 'No Sound (Visual Sparkle)', 90, 10, true, 'NEERI-GC-SPK-902', 2, 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=800&q=80', true, false),
  ('prod-003', 'Golden Mega Fountains (Anar Deluxe - 5 Pcs)', 'cat-flowerpots', 'Flower Pots (Anar)', 'Magnificent 15-foot high fountain of shimmering gold and titanium sparkles. Smooth ignition fuse with sturdy mud base.', 350, 62, 'Low / Muffled', 45, 5, true, 'NEERI-GC-POT-401', 5, 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=800&q=80', true, true),
  ('prod-004', 'Colour Changing Rainbow Fountain (Pack of 3)', 'cat-flowerpots', 'Flower Pots (Anar)', 'Fascinating color shifting effects: begins with emerald green, transitions to ruby red, and finishes with crackling gold stars.', 420, 40, 'Low / Muffled', 60, 3, true, 'NEERI-GC-POT-402', 5, 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80', true, false),
  ('prod-005', 'Zamin Special Speed Chakkar (10 Pcs)', 'cat-spinners', 'Ground Spinners (Chakkars)', 'High velocity ground spinner creating a wide 8-foot ring of fiery golden rays. Uniform spin balance.', 260, 110, 'Low / Muffled', 30, 10, true, 'NEERI-GC-CHK-108', 4, 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=800&q=80', true, true),
  ('prod-006', 'Whistling Disco Wheel Spinners (Pack of 5)', 'cat-spinners', 'Ground Spinners (Chakkars)', 'Spins rapidly while emitting melodious whistle tones followed by red & green strobe flashes.', 320, 28, 'Medium', 35, 5, true, 'NEERI-GC-CHK-109', 5, 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=800&q=80', true, false),
  ('prod-007', '12 Shots Multi-Colour Aerial Repeater Cake', 'cat-skyshots', 'Aerial Sky Shots & Shells', 'Professional grade repeating sky battery. Ascends 120 feet to deliver alternating red brocades, gold willows, and blue crackling palms.', 750, 35, 'High Thrill', 40, 1, true, 'NEERI-GC-SKY-881', 15, 'https://images.unsplash.com/photo-1533230307786-dbd8e788bc11?auto=format&fit=crop&w=800&q=80', true, true),
  ('prod-008', '30 Shots Majestic Galaxy Aerial Extravaganza', 'cat-skyshots', 'Aerial Sky Shots & Shells', 'The ultimate celebration centerpiece. Rapid-fire barrage of 30 aerial bursts filling the night sky with glittering chrysanthemums.', 1650, 18, 'High Thrill', 65, 1, true, 'NEERI-GC-SKY-882', 20, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80', true, true),
  ('prod-009', 'Hydro Thunder Green Sound Bombs (Pack of 10)', 'cat-sound', 'Sound & Thunder Crackers', 'Sound cracker strictly calibrated within the PESO permissible limit of 125 dB at 4 meters. Safe fuse and damp-resistant casing.', 190, 75, 'High Thrill', 5, 10, true, 'NEERI-GC-SND-201', 8, 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=800&q=80', true, false),
  ('prod-010', 'Sampoorna Deepavali Grand Family Box (35 Items)', 'cat-giftboxes', 'Festive Family Gift Hampers', 'Comprehensive family assortment featuring Sparklers, Chakkars, Flower Pots, Whistling Rockets, and Kid-friendly pencils in a decorative presentation carton.', 2450, 24, 'Medium', 0, 35, true, 'NEERI-GC-BX-001', 10, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', true, true),
  ('prod-011', 'Mega VIP Corporate Festive Hamper (55 Premium Items)', 'cat-giftboxes', 'Festive Family Gift Hampers', 'Exclusive luxury selection including 30-shot aerial cakes, giant electric sparklers, multi-color pots, and festival novelties in a wooden-finish keepsake chest.', 4800, 9, 'High Thrill', 0, 55, true, 'NEERI-GC-BX-002', 15, 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80', true, true)
ON CONFLICT (id) DO NOTHING;
