# Railtowns: The other side of the tracks

This project was created as part of the [Lede Program](https://ledeprogram.com/) at Columbia's Journalism School. It's a visual exploration of how the U.S. government and railroad companies worked together to aggressively settle the American West.

The story is told in three parts, using different forms of data and visualization, to learn and implement a bunch of new skills at once. I used a mix of Python (pandas, BeautifulSoup) and QGIS for web scraping and (geo)data analysis; JavaScript (GSAP, d3), Google Earth Pro, Datawrapper, and Adobe Illustrator for visualization and animation; and Svelte for web development.

It's a work in progress, and I'm updating it frequently.

## Data

### Geodata

| source | description |
| ----------- | ----------- |
| [U.S. Census Bureau TIGER/Line](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) | shapefiles for roads, railroads, places |
| [IPUMS NHGIS](https://data2.nhgis.org/main) | U.S. census tables and GIS data |
| [Jeremy Atack's historical transportation data](https://my.vanderbilt.edu/jeremyatack/data-downloads/) | shapefiles for railroads built 1826-1911 |

## Part 1: Template towns

This part examines the question: why do so many towns along a railroad look like clones?

### Animation

The raw svgs were animated using GSAP (particularly the plugins ScrollTrigger and DrawSVG).

## Part 2: Artery towns

In this part, I wanted to figure out whether towns on abandoned railroad lines saw drops in population when the railroads shut down. I use QGIS for geospatial analysis, BeautifulSoup and pandas for scraping of town population data, and d3 and RAWgraphs for data visualization.

<!-- In qgis I had a shape file of all railroads built before 1911, and a shape file of currently active railroads, so I wanted to take the difference, which would be the abandoned railroads. It turns out there is no easy way to “clip” or “erase” polylines (unlike clipping with a polygon boundary) but I finally did it, then selected by location to find towns on these lines, exported the names of about 750 towns to python. I needed population numbers from at least 1900, and turns out the only methodical source is Wikipedia, so I generated likely Wikipedia urls and scraped them for census population tables. I tried to make a heat map in observable with d3, and got this very ugly thing. I wanted to make it animated or interactive to show how different events might have influenced population but I’m still working on that. 

I couldn’t find a dataset that clearly listed when rail lines were abandoned, so to choose which abandoned lines to focus on, I read contributor comments from abandonedrails.com.

Geodata analysis in QGIS: Let's say we have the two layers "all_rails" and "current_rails", we want the difference between them to get "abandoned_rails". In an ideal scenario we would do Vector -> Geoprocessing Tools -> Difference, with the input layer "all_rails" and overlay layer "current_rails". Unfortunately that didn't work because the polylines were super complex and not exactly overlapping in all locations even though it looked like they were (like if a coordinate was listed as -45.1231 in one and -45.1235 in another). I tried various methods like snapping the layers to each other, etc. The method that finally worked was to use Vector -> Geoprocessing -> Buffer on "current_rails" (the overlay layer), which gives the polyline a buffer zone to capture everything in that zone (in this case I found that ~75-100 m buffer worked, smaller than that wasn't good enough). Then you do the Difference again with "all_rails" as input and "current_rails_buffered" as overlay. This worked OK but left a bunch of little slivers and broken tiny lines that I cleaned up with different methods
Then I did Select by Distance to select the census places within 0.25 mi of "abandoned_rails”. I wanted to look only at small, rural towns that were primarily served by the abandoned rail (in addition to roads), not towns or cities located at the intersection of many rails (including current ones) so manually curated the list of towns in QGIS to produce a csv of town names in Montana, North Dakota, South Dakota, Nebraska, Kansas, Oklahoma, and Texas. -->

<!-- Scraping: cleaned up the list of towns in pandas and tried the wikipedia scraper on them by generating the wikipedia urls. Scraped each url for `us-census-pop` table in BeautifulSoup to produce table of ~750 town. -->

## Part 3: Ghost towns

I used Google Earth satellite data and streetview images to annotate ghost towns along a very boom-bust railroad line.

## Web app

The project was built using Svelte and SvelteKit.