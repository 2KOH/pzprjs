
our $debug = 0;
our $filech = 1;
our $version = 'v3.2.3';

&main();
exit(0);

sub main{
	&input_flags();

	if($filech==1){
		if(!$debug){
			&eraseLOG();
			&printLOG("pzprBase.js $version contents\n");
		}

		&output_pzprBase();
		if(!$debug){
			&output_puzzles(); # contents.txt�Ƀt�@�C�����o�͂��邾��
		}
	}
	elsif($filech==2){
		&output_puzzles();
	}
}

sub input_flags{
	print "�ǂ̃t�@�C�����o�͂��܂����H 1:pzprBase.js 2:puzzles.js [1] ";
	$_ = <STDIN>; tr/\r\n//d;
	if(/2/){ $filech=2;}

	print "�����[�X�p�̃t�@�C�����o�͂��܂����H[y] ";
	$_ = <STDIN>; tr/\r\n//d;
	if(/n/i){ $debug=1;}

	print "�o�[�W��������͂��Ă�������[$version] ";
	$_ = <STDIN>; tr/\r\n//d;
	if($_){
		$version = $_;
		$version =~ s/\[a\]/��/g;
		$version =~ s/\[b\]/��/g;
	}
}

sub output_pzprBase{
	my @files = (
		'Camp.js',
		'global.js',
		'Board.js',
		'Graphic.js',
		'MouseInput.js',
		'KeyInput.js',
		'Encode.js',
		'Filesys.js',
		'Answer.js',
		'Undo.js',
		'Menu.js',
		'MenuExec.js',
		'pzprUtil.js',
		'Main.js'
	);

	open OUT, ">pzprBase_body_Full.js";
	if($debug){
		print OUT "// pzplBase.js �e�X�g�p\n";
	}
	print OUT "\nvar pzprversion=\"$version\";\n";
	&printfiles(\@files,1);
	close OUT;

	if(!$debug){
		&output_doc("notices.txt");

		system("java -jar ../../../yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar -o ./pzprBase_body.js ./pzprBase_body_Full.js");
		system("copy /Y /B .\\notices.txt + .\\pzprBase_body.js ..\\pzprBase.js");
		system("copy /Y /B .\\notices.txt + .\\pzprBase_body_Full.js ..\\pzprBase_Full.js");

		unlink("notices.txt");
		unlink("pzprBase_body.js");
		unlink("pzprBase_body_Full.js");
	}
	else{
		system("copy /Y .\\pzprBase_body_Full.js ..\\pzprBase.js");
		unlink("pzprBase_body_Full.js");
	}
}

sub output_puzzles{
	my @files = ();
	opendir PAR, "../";
	while(my $file = readdir PAR){
		if($file !~ /\.js$/){ next;}
		if($file =~ /p\d+\.js$/){ next;}
		if($file =~ /pzprBase/){ next;}
		if($file =~ /puzzles/){ next;}
		if($file =~ /uuCanvas\.js/){ next;}
		if($file =~ /excanvas\.js/){ next;}
		if($file =~ /jquery\.js/){ next;}
		if($file =~ /Prototype\.js/){ next;}
		if($file =~ /gears_init\.js/){ next;}
		if($file =~ /for_test\.js/){ next;}

		push @files, "../$file";
	}
	closedir PAR;
	if($filech==1){
		&printfiles(\@files,3);
		return;
	}

	open OUT, ">puzzles_Full.js";
	&printfiles(\@files,2);
	close OUT;

	if(!$debug){
		system("java -jar ../../../yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar -o ./puzzles.js ./puzzles_Full.js");

		system("copy /Y .\\puzzles.js ..");
		system("copy /Y .\\puzzles_Full.js ..");

		unlink("puzzles.js");
		unlink("puzzles_Full.js");
	}
	else{
		system("copy /Y .\\puzzles_Full.js ..\\puzzles.js");
		unlink("puzzles_Full.js");
	}
}

sub output_doc{
	my $file = shift;
	my @dates = localtime(time);
	my $datestr = sprintf("%04d-%02d-%02d",1900+$dates[5],1+$dates[4],$dates[3]);

	open DOC, ">$file";

	print DOC <<"EOR";
/* 
 * pzprBase.js
 * 
 * pzprBase.js is a base script for playing nikoli puzzles on Web
 * written in JavaScript.
 * 
 * \@author  dk22
 * \@version $version
 * \@date    $datestr
 * 
 * This script is licensed under the MIT license. See below,
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */
EOR
	close DOC;
}

# �t�@�C���o�͊֐�
sub printfiles{
	my @files = @{$_[0]};
	my $type = $_[1];

	if(!$debug and $filech==1){ &printLOG("\n");}

	foreach(@files){
		my $filename = $_;

		if($debug){
			print OUT "document.writeln(\"<script type=\\\"text/javascript\\\" src=\\\"src/pzprBase/$_\\\"></script>\");\n";
			next;
		}

		# header���̏��� => �o�[�W�������擾����
		if($type!=2){
			my @val = &get_version($filename, $type);
			&printLOG(sprintf("%-14s %-s\n",@val));

			# $type��3�Ȃ�A�o�[�W�������������o���ďI��
			if($type==3){ next;}
		}

		# ���ۂ̏o�͕�
		open SRC, $filename;
		{
			if($type==1){ <SRC>;}	# pzprBase�̃t�@�C���̓w�b�_�����o�͂��Ȃ�

			# �ϊ������������ꍇ�́A�A���̒��ɕϊ�����������ׂ�
			while(<SRC>){
				my $sline = $_;
				print OUT $sline;
			}
		}
		close SRC;
	}
}

# �o�[�W�����擾�p�֐�
sub get_version{
	my($filename, $type) = @_;
	my $sline = '';
	my @ret = ();

	open SRC, $filename;
	# pzprBase�t�H���_�̃t�@�C����version��1�s��
	if($type == 1){
		$_ = <SRC>;
		/\/\/ +([^ ]+) +([^ \r\n]+)[\r\n]*/;
		@ret = ($1,$2);
	}
	# puzzles�̃t�@�C����version��2�s��
	elsif($type == 3){
		<SRC>; $_ = <SRC>;
		/(\w+\.js) +([^ \r\n]+)[\r\n]*/;
		@ret = ($1,$2);
	}
	close SRC;

	return @ret;
}

sub eraseLOG{
	open LOG, ">contents.txt";
	close LOG;
}
sub printLOG{
	open LOG, ">>contents.txt";
	printf(LOG $_[0]);
	close LOG;
}
