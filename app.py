#! coding: utf-8
from flask import Flask, request, render_template, redirect, url_for
from flask import session, flash
from flask import jsonify
import requests
from geopy.geocoders import Nominatim
from geopy.distance import great_circle
import json
import logging

app = Flask(__name__)
app.config['SECRET_KEY'] = 'seckey'

VEHICLE_SPEED = {
    'plane': 800,
    'car': 80,
    'ship': 50
}

geolocator = Nominatim()

city_cache = {}

search_history = {}

@app.route('/geocode')
def geocode():
    city_name = request.args.get('city_name')
    if not city_name:
        return jsonify(result=[])
    if city_name in search_history:
        return jsonify(result=search_history[city_name])
    location = geolocator.geocode(city_name, exactly_one=False)
    if location is not None:
        candidates = [l.address for l in location]
        [app.logger.debug(l.address) for l in location]
        search_history[city_name] = candidates
        for l in location:
            city_cache[l.address] = [l.latitude, l.longitude]
    else:
        candidates = []
    return jsonify(result=candidates)

@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'GET':
        return render_template('index.html')
    else:
        try:
            sources = request.form.getlist('from')
            dests = request.form.getlist('to')
            if not all(sources) or not all(dests):
                raise ValueError('必须填写所有地址')
            vehicles = request.form.getlist('vehicle')
            use_map = request.form['map']
            paths = []
            periods = []
            dists = []
            need_hours = []
            for source, dest, vehicle in zip(sources, dests, vehicles):
                paths.append([source.split(', ')[0], dest.split(', ')[0], vehicle])
                try:
                    dist = great_circle(city_cache[source], city_cache[dest]).km
                except KeyError as e:
                    raise ValueError('没有这个地址: %s' % e.message.encode('utf-8'))
                dists.append(round(dist, 2))
                need_hour = round(dist/VEHICLE_SPEED[vehicle], 2)
                app.logger.debug(
                        'the distance between "%s" and "%s" is %.2f km' % (
                            source, dest, dist
                        ))
                app.logger.debug('it approximately takes %.2f hours by %s ' % (
                        need_hour, vehicle
                        ))
                periods.append(need_hour)
                need_hours.append(need_hour)
            if use_map == 'world':
                zoom = round(15000.0 / max(dists))
            else:
                zoom = round(5000.0 / max(dists))
            scale = 10.0 / min(periods)
            periods = [scale * x for x in periods]
            geo_coord_map = {}
            try:
                for source in sources:
                    geo_coord_map[source.split(', ')[0]] = \
                            list(reversed(city_cache[source]))
                for dest in dests:
                    geo_coord_map[dest.split(', ')[0]] = \
                            list(reversed(city_cache[dest]))
            except KeyError as e:
                raise ValueError('没有这个地址: %s' % e.message.encode('utf-8'))
            city_list = geo_coord_map.keys()
            laltitudes = [coords[0] for coords in geo_coord_map.values()]
            longitudes = [coords[1] for coords in geo_coord_map.values()]
            center = [(max(laltitudes) + min(laltitudes)) / 2,
                      (max(longitudes) + min(longitudes)) / 2]
        except Exception as e:
            app.logger.debug(str(e))
            flash(str(e))
            return render_template('index.html')
        return render_template('map.html', paths=json.dumps(paths),
                geo_coord_map=json.dumps(geo_coord_map),
                city_list=json.dumps(city_list),
                periods=periods, center=center, zoom=zoom,
                use_map=json.dumps(use_map), dists=dists, need_hours=need_hours)

@app.before_first_request
def setup_logging():
    if not app.debug:
        # In production mode, add log handler to sys.stderr.
        app.logger.addHandler(logging.StreamHandler())
        app.logger.setLevel(logging.DEBUG)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8291, debug=True)
