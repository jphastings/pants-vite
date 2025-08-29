javascript_sources()

package_json(
    name="website-package",
    scripts=[
        node_build_script(
            entry_point = "build",
            output_directories = ["dist/"],
        ),
    ],

    # HERE: the absence of this line triggers a failure
    # dependencies=[":site-files"],
    
    # HERE: The presence of this line hides the uname error, making the build error more visible
    # extra_env_vars=["PATH=/usr/bin"],
)

# I didn't have this originally; but the error remains until it's flagged as a dependency
files(
  name="site-files",
  description="The non-JS files needed to build the site",
  sources=["src/**/*", "public/**/*", "*.html"],
)
