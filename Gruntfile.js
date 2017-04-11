/**
 * Created by Antoine on 07/04/2017.
 */
module.exports = function (grunt) {
		// Project configuration.
		grunt.initConfig({
				pkg: grunt.file.readJSON('package.json'),
				// clean: {
				//     build: ['src'],
				//     release: ['dist']
				// },
				concat: {
						options: {
								separator: ';'
						},
						dist: {
								src: ['src/**/*.js'],
								dest: 'dist/<%= pkg.name %>.js'
						}
				},
				uglify: {
						options: {
								banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
						},
						build: {
								src: 'src/<%= pkg.name %>.js',
								dest: 'dist/<%= pkg.name %>.min.js'
						}
				},
				jshint: {
						files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
						options: {
								globals: {
										jQuery: true,
										console: true,
										module: true,
								},
								esversion: 6
						}
				},
				watch: {
						files: ['<%= jshint.files %>'],
						tasks: ['jshint']
				}
		});

		// Load the plugin that provides the "uglify" task.
		// grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-contrib-concat');

		// Default task(s).
		grunt.registerTask('default', [/*'clean', */'jshint', 'concat', 'uglify']);
};