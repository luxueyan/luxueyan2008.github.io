var lua_script = (function() {
  var tmp;
  var G = lua_newtable2(lua_core);
  for (var i in lua_libs) {
    G.str[i] = lua_newtable2(lua_libs[i]);
  }
  G.str['arg'] = lua_newtable();
  G.str['_G'] = G;
  G.str['module'] = function (name) {
    lua_createmodule(G, name, slice(arguments, 1));
  };
  G.str['require'] = function (name) {
    lua_require(G, name);
  };
  G.str['package'].str['seeall'] = function (module) {
    if (!module.metatable) {
      module.metatable = lua_newtable();
    }
    module.metatable.str['__index'] = G;
  };
  {
    G.str['NUM_BACKGROUND_WAVES'] = 7;
    G.str['BACKGROUND_WAVE_MAX_HEIGHT'] = 5;
    G.str['BACKGROUND_WAVE_COMPRESSION'] = (1 / 5);
    G.str['sineOffsets'] = lua_newtable();
    G.str['sineAmplitudes'] = lua_newtable();
    G.str['sineStretches'] = lua_newtable();
    G.str['offsetStretches'] = lua_newtable();
    var var_2 = 1, stop_2 = lua_assertfloat(G.str['NUM_BACKGROUND_WAVES']);
    for (; var_2 <= stop_2; var_2++) {
      var _i_2 = var_2;
      lua_tablegetcall(G.str['table'], 'insert', [G.str['sineOffsets'], lua_add(-1, lua_multiply(2, lua_tablegetcall(G.str['math'], 'random', [])[0]))]);
      lua_tablegetcall(G.str['table'], 'insert', [G.str['sineAmplitudes'], lua_multiply(lua_tablegetcall(G.str['math'], 'random', [])[0], G.str['BACKGROUND_WAVE_MAX_HEIGHT'])]);
      lua_tablegetcall(G.str['table'], 'insert', [G.str['sineStretches'], lua_multiply(lua_tablegetcall(G.str['math'], 'random', [])[0], G.str['BACKGROUND_WAVE_COMPRESSION'])]);
      lua_tablegetcall(G.str['table'], 'insert', [G.str['offsetStretches'], lua_multiply(lua_tablegetcall(G.str['math'], 'random', [])[0], G.str['BACKGROUND_WAVE_COMPRESSION'])]);
    }
    G.str['overlapSines'] = (function (_x) {
      var tmp;
      var _result_4 = 0;
      var var_5 = 1, stop_5 = lua_assertfloat(G.str['NUM_BACKGROUND_WAVES']);
      for (; var_5 <= stop_5; var_5++) {
        var _i_5 = var_5;
        _result_4 = lua_add(lua_add(_result_4, lua_tableget(G.str['sineOffsets'], _i_5)), lua_multiply(lua_tableget(G.str['sineAmplitudes'], _i_5), lua_tablegetcall(G.str['math'], 'sin', [lua_add(lua_multiply(_x, lua_tableget(G.str['sineStretches'], _i_5)), lua_multiply(G.str['offset'], lua_tableget(G.str['offsetStretches'], _i_5)))])[0]));
      }
      return [_result_4];
      return [];
    })
    G.str['wavePoints'] = lua_call(G.str['makeWavePoints'], [G.str['NUM_POINTS']])[0];
    G.str['updateWavePoints'] = (function (_points, _dt) {
      var tmp;
      var var_8 = 1, stop_8 = lua_assertfloat(G.str['ITERATIONS']);
      for (; var_8 <= stop_8; var_8++) {
        var _i_8 = var_8;
        tmp = lua_call(G.str['ipairs'], [_points]);
        var f_10 = tmp[0], s_10 = tmp[1], var_10 = tmp[2];
        while ((tmp = lua_call(f_10, [s_10, var_10]))[0] != null) {
          var_10 = tmp[0];
          var _n_10 = var_10, _p_10 = tmp[1];
          tmp = null;
          var _force_11 = 0;
          var _forceFromLeft_11, _forceFromRight_11;
          if (lua_eq(_n_10, 1)) {
            var _dy_12 = lua_subtract(lua_tableget(lua_tableget(_points, lua_len(_points)), 'y'), lua_tableget(_p_10, 'y'));
            _forceFromLeft_11 = lua_multiply(G.str['SPRING_CONSTANT'], _dy_12);
          } else {
            var _dy_13 = lua_subtract(lua_tableget(lua_tableget(_points, lua_subtract(_n_10, 1)), 'y'), lua_tableget(_p_10, 'y'));
            _forceFromLeft_11 = lua_multiply(G.str['SPRING_CONSTANT'], _dy_13);
          }
          if (lua_eq(_n_10, lua_len(_points))) {
            var _dy_14 = lua_subtract(lua_tableget(lua_tableget(_points, 1), 'y'), lua_tableget(_p_10, 'y'));
            _forceFromRight_11 = lua_multiply(G.str['SPRING_CONSTANT'], _dy_14);
          } else {
            var _dy_15 = lua_subtract(lua_tableget(lua_tableget(_points, lua_add(_n_10, 1)), 'y'), lua_tableget(_p_10, 'y'));
            _forceFromRight_11 = lua_multiply(G.str['SPRING_CONSTANT'], _dy_15);
          }
          var _dy_11 = lua_subtract(G.str['Y_OFFSET'], lua_tableget(_p_10, 'y'));
          G.str['forceToBaseline'] = lua_multiply(G.str['SPRING_CONSTANT_BASELINE'], _dy_11);
          _force_11 = lua_add(_force_11, _forceFromLeft_11);
          _force_11 = lua_add(_force_11, _forceFromRight_11);
          _force_11 = lua_add(_force_11, G.str['forceToBaseline']);
          var _acceleration_11 = lua_divide(_force_11, lua_tableget(_p_10, 'mass'));
          lua_tableset(lua_tableget(_p_10, 'spd'), 'y', lua_add(lua_multiply(G.str['DAMPING'], lua_tableget(lua_tableget(_p_10, 'spd'), 'y')), _acceleration_11));
          lua_tableset(_p_10, 'y', lua_add(lua_tableget(_p_10, 'y'), lua_tableget(lua_tableget(_p_10, 'spd'), 'y')));
        }
        tmp = null;
      }
      return [];
    })
    lua_tableset(G.str['love'], 'update', (function (_dt) {
      var tmp;
      if (lua_true(lua_tablegetcall(lua_tableget(G.str['love'], 'keyboard'), 'isDown', ["k"])[0])) {
        G.str['offset'] = lua_add(G.str['offset'], 1);
      }
      if (lua_true(lua_tablegetcall(lua_tableget(G.str['love'], 'mouse'), 'isDown', ["l"])[0])) {
        tmp = lua_tablegetcall(lua_tableget(G.str['love'], 'mouse'), 'getPosition', []); var _mouseX_18 = tmp[0]; var _mouseY_18 = tmp[1]; tmp = null;
        var _closestPoint_18 = null;
        var _closestDistance_18 = null;
        tmp = lua_call(G.str['ipairs'], [G.str['wavePoints']]);
        var f_19 = tmp[0], s_19 = tmp[1], var_19 = tmp[2];
        while ((tmp = lua_call(f_19, [s_19, var_19]))[0] != null) {
          var_19 = tmp[0];
          var ___19 = var_19, _p_19 = tmp[1];
          tmp = null;
          var _distance_20 = lua_tablegetcall(G.str['math'], 'abs', [lua_subtract(_mouseX_18, lua_tableget(_p_19, 'x'))])[0];
          if (lua_eq(_closestDistance_18, null)) {
            _closestPoint_18 = _p_19;
            _closestDistance_18 = _distance_20;
          } else {
            if (lua_lte(_distance_20, _closestDistance_18)) {
              _closestPoint_18 = _p_19;
              _closestDistance_18 = _distance_20;
            }
          }
        }
        tmp = null;
        lua_tableset(_closestPoint_18, 'y', lua_tablegetcall(lua_tableget(G.str['love'], 'mouse'), 'getY', [])[0]);
      }
      lua_call(G.str['updateWavePoints'], [G.str['wavePoints'], _dt]);
      return [];
    }))
    var _circle_1 = lua_tableget(lua_tableget(G.str['love'], 'graphics'), 'circle');
    var _line_1 = lua_tableget(lua_tableget(G.str['love'], 'graphics'), 'line');
    var _color_1 = lua_tableget(lua_tableget(G.str['love'], 'graphics'), 'setColor');
    lua_tablegetcall(lua_tableget(G.str['love'], 'graphics'), 'setBackgroundColor', [0xff, 0xff, 0xff]);
    lua_tableset(G.str['love'], 'draw', (function (_dt) {
      var tmp;
      lua_call(_color_1, [0xff, 0x33, 0x33]);
      lua_call(_line_1, [0, G.str['Y_OFFSET'], G.str['WIDTH'], G.str['Y_OFFSET']]);
      tmp = lua_tablegetcall(lua_tableget(G.str['love'], 'mouse'), 'getPosition', []); var _mouseX_24 = tmp[0]; var _mouseY_24 = tmp[1]; tmp = null;
      lua_call(_line_1, [_mouseX_24, 0, _mouseX_24, G.str['Y_OFFSET']]);
      if (lua_true(lua_tablegetcall(lua_tableget(G.str['love'], 'mouse'), 'isDown', ["l"])[0])) {
        lua_tablegetcall(lua_tableget(G.str['love'], 'graphics'), 'circle', ["line", _mouseX_24, _mouseY_24, 20]);
      }
      if (lua_true(lua_tablegetcall(lua_tableget(G.str['love'], 'keyboard'), 'isDown', ["k"])[0])) {
        lua_tablegetcall(lua_tableget(G.str['love'], 'graphics'), 'print', ["Overlap waves PLAY", 10, lua_add(G.str['Y_OFFSET'], 50)]);
      } else {
        lua_tablegetcall(lua_tableget(G.str['love'], 'graphics'), 'print', ["Overlap waves PAUSED", 10, lua_add(G.str['Y_OFFSET'], 50)]);
      }
      tmp = lua_call(G.str['ipairs'], [G.str['wavePoints']]);
      var f_28 = tmp[0], s_28 = tmp[1], var_28 = tmp[2];
      while ((tmp = lua_call(f_28, [s_28, var_28]))[0] != null) {
        var_28 = tmp[0];
        var _n_28 = var_28, _p_28 = tmp[1];
        tmp = null;
        lua_call(_color_1, [0xaa, 0xaa, 0xbb]);
        lua_call(_circle_1, ["line", lua_tableget(_p_28, 'x'), lua_add(G.str['Y_OFFSET'], lua_call(G.str['overlapSines'], [lua_tableget(_p_28, 'x')])[0]), 2]);
        lua_call(_color_1, [0x00, 0x33, 0xbb]);
        lua_call(_circle_1, ["line", lua_tableget(_p_28, 'x'), lua_add(lua_tableget(_p_28, 'y'), lua_call(G.str['overlapSines'], [lua_tableget(_p_28, 'x')])[0]), 4]);
        if (lua_eq(_n_28, 1)) {
          
        } else {
          var _leftPoint_31 = lua_tableget(G.str['wavePoints'], lua_subtract(_n_28, 1));
          lua_call(_line_1, [lua_tableget(_leftPoint_31, 'x'), lua_add(lua_tableget(_leftPoint_31, 'y'), lua_call(G.str['overlapSines'], [lua_tableget(_leftPoint_31, 'x')])[0]), lua_tableget(_p_28, 'x'), lua_add(lua_tableget(_p_28, 'y'), lua_call(G.str['overlapSines'], [lua_tableget(_p_28, 'x')])[0])]);
        }
      }
      tmp = null;
      return [];
    }))
  };
  return [G];
})()[0];
