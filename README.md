# Railtowns: The other side of the tracks

This project was created as part of the 2025 [Lede Program](https://ledeprogram.com/) at Columbia's Journalism School. It's a three-part visual exploration of how the U.S. government and railroad companies worked together to aggressively settle the American West.

I first analyzed national-, state-, and town-level geospatial and census data to identify and explore three distinct railroad-driven settlement patterns. I used QGIS and satellite imagery to map abandoned rail lines and identify affected towns, Python and D3/Observable to scrape and chart population data, and the JavaScript library GSAP and Svelte to build a scrolly experience coordinating animations between train routes and town grids. Each of the three chapters experiments with different forms of data and visualization, to learn and implement a bunch of new skills at once.

It's a work in progress, and I'm updating it frequently.

## Data

| source | description |
| ----------- | ----------- |
| [U.S. Census Bureau TIGER/Line](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) | shapefiles for roads, railroads, places |
| [IPUMS NHGIS](https://data2.nhgis.org/main) | U.S. census tables and GIS data |
| [Jeremy Atack's historical transportation data](https://my.vanderbilt.edu/jeremyatack/data-downloads/) | shapefiles for railroads built 1826-1911 |
| [Forgotten Lands, Places and Transit](https://www.frrandp.com/p/the-map.html) | crowdsourced enthusiast map, useful for context and anecdotes |
| [Abandoned Rails](https://www.abandonedrails.com/) | crowdsourced enthusiast map, useful for context and anecdotes |

## Part 1: Template towns

Why do so many towns along a railroad look like clones?

I identified similar towns along the Illinois Central Railroad with Google Maps, used Datawrapper to extract vector files of the their street grids, and styled SVG maps with Illustrator. The raw svgs were then animated using Svelte and GreenSock Animation Platform (GSAP), particularly the plugins ScrollTrigger and DrawSVG.

### Things I still want to add/fix

- Bug: map images don't clear properly with extremely fast scrolling

## Part 2: Artery towns

What happened to railroad towns when their rail lines dried up?

I used QGIS for geospatial analysis, Python (BeautifulSoup and pandas) for scraping of town population data, and D3/Observable for data visualization.

QGIS: To create a map of abandoned lines, I took the spatial difference between Jeremy Atack's shapefile of railroads built by 1911, and the TIGER/line shapefile of currently active railroads. To find small, rural towns served primarily by these abandoned rails, I identified census "Places" within 0.25 mi of the abandoned lines and manually curated the list to remove towns that are also on active lines and larger cities. I exported a csv of town names (~750 towns) in Montana, North Dakota, South Dakota, Nebraska, Kansas, Oklahoma, and Texas.

Scraping of population data: I needed population numbers from at least 1900. U.S. Census Bureau and IPUMS census data of "Places" populations is spotty and/or incomplete before 1950/1980, and the most complete and extractable source I could find turned out to be Wikipedia (I gather that this data was crowdsourced from digitized images of census books). I used Python/pandas to generate likely Wikipedia urls from the list of town names and scraped each url for the `us-census-pop` table in BeautifulSoup to produce a csv of ~750 town populations, from town founding to present.

I couldn’t find a dataset that clearly listed when rail lines were abandoned, so to choose which abandoned lines (e.g. the Cowboy Line) to focus on for the D3 visualizations, I read contributor comments from Abandoned Rails & Forgotten Lands, Places and Transit.

<!-- In qgis I had a shape file of all railroads built before 1911, and a shape file of currently active railroads, so I wanted to take the difference, which would be the abandoned railroads. It turns out there is no easy way to “clip” or “erase” polylines (unlike clipping with a polygon boundary) but I finally did it, then selected by location to find towns on these lines, exported the names of about 750 towns to python. I needed population numbers from at least 1900, and turns out the only methodical source is Wikipedia, so I generated likely Wikipedia urls and scraped them for census population tables. I tried to make a heat map in observable with d3, and got this very ugly thing. I wanted to make it animated or interactive to show how different events might have influenced population but I’m still working on that. 

I couldn’t find a dataset that clearly listed when rail lines were abandoned, so to choose which abandoned lines to focus on, I read contributor comments from abandonedrails.com. -->

<!-- Geodata analysis in QGIS: Let's say we have the two layers "all_rails" and "current_rails", we want the difference between them to get "abandoned_rails". In an ideal scenario we would do Vector -> Geoprocessing Tools -> Difference, with the input layer "all_rails" and overlay layer "current_rails". Unfortunately that didn't work because the polylines were super complex and not exactly overlapping in all locations even though it looked like they were (like if a coordinate was listed as -45.1231 in one and -45.1235 in another). I tried various methods like snapping the layers to each other, etc. The method that finally worked was to use Vector -> Geoprocessing -> Buffer on "current_rails" (the overlay layer), which gives the polyline a buffer zone to capture everything in that zone (in this case I found that ~75-100 m buffer worked, smaller than that wasn't good enough). Then you do the Difference again with "all_rails" as input and "current_rails_buffered" as overlay. This worked OK but left a bunch of little slivers and broken tiny lines that I cleaned up with different methods
Then I did Select by Distance to select the census places within 0.25 mi of "abandoned_rails”. I wanted to look only at small, rural towns that were primarily served by the abandoned rail (in addition to roads), not towns or cities located at the intersection of many rails (including current ones) so manually curated the list of towns in QGIS to produce a csv of town names in Montana, North Dakota, South Dakota, Nebraska, Kansas, Oklahoma, and Texas. -->

### Things I still want to add/fix

- Add intro to abandoned lines section
- Add historical annotations (line abandonment, Great Depression, national rail policy changes) to population map to provide context for population changes
- Zoom in on towns on Cowboy Line (make more visible), figure out how to link population data to the towns on the map either with labels or some other visualization
- Fix or add disclaimer for missing data point for 1970 Clinton

## Part 3: Ghost towns

Why was one particular rail line so ill-fated?

QGIS: I used rail shapefiles as well as several raster map images ([here](https://ftpgeoinfo.msl.mt.gov/Documents/Maps/Individual/20180817_788_20170626_MT_Railroad_AllRoads.pdf), [here](https://en.wikipedia.org/wiki/Great_Northern_Railway_%28U.S.%29#/media/File:GN_Route_Map.png), [here](https://upload.wikimedia.org/wikipedia/commons/f/f5/Northern_Pacific_Railroad_map_circa_1900.jpg)) to create a map of three key railroads through Montana: the (ill-fated) Milwaukee Road, the Great Northern, and the Northern Pacific. I added population centers and the ESRI satellite base map.

### Things I still want to add/fix

- Annotate map and build zoomed-in parts to show agricultural regions and population centers (where Great Northern and Northern Pacific go through) vs. arid sparsely populated areas that Milwaukee goes through
- I have many more satellite and Google Streetview images of towns, build interactive link between Milwaukee line and more images of these ghost towns
- Maybe make explicit narrative connection to data center development now
- Fix wonky spacing/alignment