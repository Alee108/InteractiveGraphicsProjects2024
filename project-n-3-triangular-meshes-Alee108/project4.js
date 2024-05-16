// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [TO-DO] Modify the code below to form the transformation matrix.
	var rotation_X = [1, 0, 0 ,0, 
					  0, Math.cos(rotationX), Math.sin(rotationX), 0,
					  0, -Math.sin(rotationX), Math.cos(rotationX), 0,
					  0, 0, 0, 1

	];

	var rotation_Y = [ Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
						0, 1, 0, 0,
						Math.sin(rotationY), 0, Math.cos(rotationY), 0,
						0, 0, 0, 1

	];
	 var translation = [ 1, 0, 0, 0,
		                 0, 1, 0, 0,
						 0, 0, 1, 0,
						 translationX, translationY, translationZ, 1

	 ];

	var trans = MatrixMult(MatrixMult(translation,rotation_X),rotation_Y);
	var mvp = MatrixMult( projectionMatrix, trans ); 
	return mvp;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		// [TO-DO] initializations
		this.prog = InitShaderProgram(meshVS, meshFS);

		this.mymvp = gl.getUniformLocation(this.prog, 'mvp');
		this.mypos = gl.getAttribLocation(this.prog, 'pos');
		this.swapLoc= gl.getUniformLocation(this.prog, 'swap');
		this.mytexCoords = gl.getAttribLocation(this.prog, 'texCoords');
		this.mytex = gl.getUniformLocation(this.prog, 'tex');
		this.showTex = gl.getUniformLocation(this.prog, 'show');


		this.v_buffer = gl.createBuffer();
		this.t_buffer = gl.createBuffer();

	;
		 
}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords )
	{
		

		// [TO-DO] Update the contents of the vertex buffer objects.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.v_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.t_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

		this.numTriangles = vertPos.length / 3;

		
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		// [TO-DO] Set the uniform parameter(s) of the vertex shader
		gl.useProgram(this.prog);
		gl.uniform1i(this.swapLoc, swap);
	}
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
		// [TO-DO] Complete the WebGL initializations before drawing
		gl.useProgram(this.prog);

		gl.uniformMatrix4fv(this.mymvp, false, trans );

		gl.bindBuffer(gl.ARRAY_BUFFER, this.v_buffer);
		gl.vertexAttribPointer(this.mypos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.mypos);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.t_buffer);
		gl.vertexAttribPointer(this.mytexCoords, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.mytexCoords);
		

		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles);
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		// [TO-DO] Bind the texture
		const mytex = gl.createTexture();
		//gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, mytex);
		// You can set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );
		gl.generateMipmap(gl.TEXTURE_2D);
		// [TO-DO] Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
		sampler = gl.getUniformLocation(this.prog, 'tex');
		gl.useProgram(this.prog);
		gl.uniform1i(sampler, 0);

	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
		gl.useProgram(this.prog);
		gl.uniform1i(this.showTex, show);
	}
	
}
var meshVS = `
 attribute vec3 pos;
 uniform mat4 mvp;
 attribute vec2 texCoords;
 uniform bool swap;

 varying vec2 txc;

 void main(){
	if(swap){
	gl_Position = mvp * vec4(pos.xzy,1); 
	}
	else {
		gl_Position = mvp * vec4(pos.xyz,1);
	}
	txc = texCoords;
 }

`
;
var meshFS = `
precision mediump float;
uniform sampler2D tex;
varying vec2 txc;
uniform bool show;

void main()
{
	if(show){
		gl_FragColor = texture2D(tex, txc);

	} else{
		gl_FragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,0,1);

	}
}
`;