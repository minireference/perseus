# Perseus mobile

The goal is to package the perseus renderer as a standalone js application that
can run in a WebView.



TODO:

  - add css for Image max-width

Done:

  - build single js bundle of ke dependencies (using r.js, see `ke-deps.build.js`)
  - build non-requirejs bundle of perseus (see `webpack.config.standalone.js`)
  - added `standalonebuild` target to Makefile for the above two


## Standalone build

[example](http://localhost:9000/standalone.html#content={"question"%3A{"content"%3A"Hello. Which is the number that is the answer to the universe and evertyhing  \nx %3D [[☃ numeric-input 1]]\n\n\n"%2C"images"%3A{}%2C"widgets"%3A{"numeric-input 1"%3A{"type"%3A"numeric-input"%2C"alignment"%3A"default"%2C"static"%3Afalse%2C"graded"%3Atrue%2C"options"%3A{"static"%3Afalse%2C"answers"%3A[{"value"%3A42%2C"status"%3A"correct"%2C"message"%3A""%2C"simplify"%3A"required"%2C"strict"%3Afalse%2C"maxError"%3Anull}]%2C"size"%3A"normal"%2C"coefficient"%3Afalse%2C"labelText"%3A""}%2C"version"%3A{"major"%3A0%2C"minor"%3A0}}}}%2C"answerArea"%3A{"calculator"%3Afalse%2C"chi2Table"%3Afalse%2C"periodicTable"%3Afalse%2C"tTable"%3Afalse%2C"zTable"%3Afalse}%2C"itemDataVersion"%3A{"major"%3A0%2C"minor"%3A1}%2C"hints"%3A[{"replace"%3Afalse%2C"content"%3A"A hitn is this."%2C"images"%3A{}%2C"widgets"%3A{}}]})





## Getting Started

To get the dev server running locally, try `make server PORT=9000`
which will run the local perseus server on localhost:9000.
Then visit http://localhost:9000/test.html.

To package perseus for distribution, run `make build` and to package a debug-friendly build, run `make debug`.

Both the `build` and the `server` make targets will run `npm install` but you can also run it yourself to install all node dependencies.




## License

[MIT License](http://opensource.org/licenses/MIT)
